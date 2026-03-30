import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Wallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    
    # 1. Available Balance
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # 2. 👇 NEW FIELD: Escrow Balance (Locked Funds)
    escrow_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    currency = models.CharField(max_length=3, default='KES')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s Wallet ({self.currency} {self.balance})"

class Transaction(models.Model):
    class Type(models.TextChoices):
        DEPOSIT = "DEPOSIT", "M-Pesa Deposit"
        WITHDRAWAL = "WITHDRAWAL", "Withdrawal"
        ESCROW_LOCK = "ESCROW_LOCK", "Locked for Job"
        ESCROW_RELEASE = "ESCROW_RELEASE", "Released to Seller"
        REFUND = "REFUND", "Refund to Buyer"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=Type.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    reference = models.CharField(max_length=100, unique=True, help_text="M-Pesa Receipt or Internal Ref")
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"