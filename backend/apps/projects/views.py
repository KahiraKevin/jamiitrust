from django.contrib.auth import get_user_model # 👈 Import User model
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import transaction
from .models import Project, Milestone
from .serializers import ProjectCreateSerializer, ProjectReadSerializer, MilestoneSerializer
from .services import EscrowService
from apps.wallets.models import Wallet 

User = get_user_model() # 👈 Initialize User model

class ProjectViewSet(viewsets.ModelViewSet):
    """
    CRUD for Projects with Balance Check & Seller Lookup.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return ProjectCreateSerializer
        return ProjectReadSerializer

    def get_queryset(self):
        user = self.request.user
        # Users see projects they own (Buyer) or are assigned to (Seller)
        return Project.objects.filter(buyer=user) | Project.objects.filter(seller=user)

    def create(self, request, *args, **kwargs):
        """
        Overriding create to add:
        1. Seller Lookup (Email -> User ID)
        2. Wallet Balance Check
        3. Locking Funds (Atomic Transaction)
        """
        # 1. Validate Form Data (Title, Description, Budget, etc.)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 2. LOOK UP SELLER BY EMAIL
        # The frontend sends 'freelancer_email', so we catch it here.
        seller_email = request.data.get('freelancer_email')
        
        # Guard clause: Ensure email was sent
        if not seller_email:
             return Response({"error": "Freelancer/Seller email is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Database Lookup
        try:
            seller = User.objects.get(email=seller_email)
        except User.DoesNotExist:
            return Response(
                {"error": f"User with email '{seller_email}' does not exist on Jamii Trust. Please check the spelling."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prevent hiring yourself
        if seller.id == request.user.id:
            return Response({"error": "You cannot hire yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Get Project Cost & Buyer
        budget = serializer.validated_data.get('budget')
        buyer = request.user

        # 4. START ATOMIC TRANSACTION (Safety First!)
        with transaction.atomic():
            
            # A. Lock the Wallet Row
            try:
                wallet = Wallet.objects.select_for_update().get(user=buyer)
            except Wallet.DoesNotExist:
                return Response(
                    {"error": "Wallet not found. Please deposit funds first."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # B. 🛑 GATEKEEPER CHECK: Do they have enough money?
            if wallet.balance < budget:
                return Response(
                    {
                        "error": "Insufficient Funds",
                        "message": f"You need KES {budget} but only have KES {wallet.balance}. Please deposit funds first."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # C. DEDUCT & LOCK FUNDS
            wallet.balance -= budget
            # Ensure 'escrow_balance' exists in your Wallet model!
            if hasattr(wallet, 'escrow_balance'):
                wallet.escrow_balance += budget
            wallet.save()

            # D. Save Project with the found SELLER object
            # We explicitly pass the 'seller' object we found in Step 2
            project = serializer.save(buyer=buyer, seller=seller, status='PENDING')

        # 5. Return Success
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MilestoneViewSet(viewsets.GenericViewSet):
    """
    Actions for Milestones: Fund, Submit, Approve.
    """
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def fund(self, request, pk=None):
        try:
            milestone = EscrowService.fund_milestone(request.user, pk)
            return Response({'status': 'funded', 'milestone_status': milestone.status})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        try:
            milestone = EscrowService.submit_milestone(request.user, pk)
            return Response({'status': 'submitted', 'auto_release_date': milestone.auto_release_date})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        try:
            milestone = EscrowService.release_milestone(request.user, pk)
            return Response({'status': 'released', 'milestone_status': milestone.status})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)