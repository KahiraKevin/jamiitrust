from rest_framework import serializers
from .models import Dispute

class DisputeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispute
        fields = ['id', 'milestone', 'initiator', 'reason', 'status', 'resolution_notes', 'created_at']
        read_only_fields = ['initiator', 'status', 'resolution_notes', 'created_at']