from django.db import transaction
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from .models import Milestone
from apps.wallets.models import Wallet, Transaction

class EscrowService:
    
    @staticmethod
    def fund_milestone(user, milestone_id):
        """
        Activates a milestone (Moves status from PENDING -> FUNDED).
        Note: Money was already locked at Project Creation, so this just updates status.
        """
        milestone = get_object_or_404(Milestone, id=milestone_id)
        
        # Validation
        if user != milestone.project.buyer:
            raise ValidationError("Only the Buyer can activate this milestone.")

        # Update Status
        if milestone.status == Milestone.Status.PENDING:
            milestone.status = Milestone.Status.FUNDED
            milestone.save()
            
        return milestone

    @staticmethod
    def submit_milestone(user, milestone_id):
        milestone = get_object_or_404(Milestone, id=milestone_id)
        
        if user != milestone.project.seller:
            raise ValidationError("Only the assigned seller can submit work.")

        milestone.status = Milestone.Status.SUBMITTED
        milestone.submitted_at = timezone.now()
        milestone.save()
        
        return milestone

    @staticmethod
    def release_milestone(user, milestone_id):
        milestone = get_object_or_404(Milestone, id=milestone_id)
        project = milestone.project
        amount = milestone.amount

        if user != project.buyer:
            raise ValidationError("Only the Buyer can release funds.")
        
        # Prevent double payment
        if milestone.status == Milestone.Status.PAID:
            raise ValidationError("Funds already released.")

        with transaction.atomic():
            buyer_wallet = Wallet.objects.select_for_update().get(user=project.buyer)
            seller_wallet = Wallet.objects.select_for_update().get(user=project.seller)

            if buyer_wallet.escrow_balance < amount:
                 raise ValidationError("Critical Error: Escrow balance mismatch.")
            
            # Move Money: Escrow -> Seller Available
            buyer_wallet.escrow_balance -= amount
            seller_wallet.balance += amount

            buyer_wallet.save()
            seller_wallet.save()
            
            milestone.status = Milestone.Status.PAID
            milestone.save()
            
            # Record Transactions
            Transaction.objects.create(
                wallet=buyer_wallet, amount=-amount, transaction_type='ESCROW_RELEASE', 
                status='COMPLETED', reference=f"REL_{milestone.id}", description=f"Released for {milestone.description}"
            )
            Transaction.objects.create(
                wallet=seller_wallet, amount=amount, transaction_type='ESCROW_RELEASE', 
                status='COMPLETED', reference=f"EARN_{milestone.id}", description=f"Earned from {milestone.description}"
            )

            return milestone