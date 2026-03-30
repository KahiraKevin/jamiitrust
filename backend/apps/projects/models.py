import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Project(models.Model):
    class Status(models.TextChoices):
        OPEN = "OPEN", "Open for Bids"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects_bought')
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects_sold')
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    # 👇 ADDED BUDGET FIELD HERE
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Milestone(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending Funding"
        FUNDED = "FUNDED", "Funded (Escrow Active)"
        SUBMITTED = "SUBMITTED", "Work Submitted"
        PAID = "PAID", "Released to Seller"
        DISPUTED = "DISPUTED", "Under Dispute"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    # Timers
    submitted_at = models.DateTimeField(null=True, blank=True)
    auto_release_date = models.DateTimeField(null=True, blank=True, help_text="Funds auto-release after this date")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project.title} - {self.description} ({self.amount})"