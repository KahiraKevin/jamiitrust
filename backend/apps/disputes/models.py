import uuid
from django.db import models
from django.conf import settings
from apps.projects.models import Milestone

class Dispute(models.Model):
    class Status(models.TextChoices):
        OPEN = "OPEN", "Open"
        RESOLVED_REFUND = "RESOLVED_REFUND", "Resolved (Refunded Buyer)"
        RESOLVED_RELEASE = "RESOLVED_RELEASE", "Resolved (Released to Seller)"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    milestone = models.OneToOneField(Milestone, on_delete=models.CASCADE, related_name='dispute')
    initiator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='disputes_started')
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    resolution_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dispute on {self.milestone} by {self.initiator}"