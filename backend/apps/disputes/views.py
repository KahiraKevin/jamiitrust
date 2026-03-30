from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.db import transaction
from .models import Dispute
from .serializers import DisputeSerializer
from apps.projects.models import Milestone

class DisputeViewSet(viewsets.ModelViewSet):
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Dispute.objects.filter(initiator=user)

    def perform_create(self, serializer):
        milestone = serializer.validated_data['milestone']
        
        # Validation: Only involved parties can dispute
        if self.request.user not in [milestone.project.buyer, milestone.project.seller]:
            raise serializers.ValidationError("You are not a party to this transaction.")

        # Validation: Can only dispute active milestones
        if milestone.status not in [Milestone.Status.FUNDED, Milestone.Status.SUBMITTED]:
            raise serializers.ValidationError("Cannot dispute a milestone that is not active.")

        with transaction.atomic():
            # 1. Create Dispute
            serializer.save(initiator=self.request.user)
            
            # 2. Lock Milestone
            milestone.status = Milestone.Status.DISPUTED
            milestone.save()