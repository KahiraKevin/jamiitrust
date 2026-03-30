import uuid
from decimal import Decimal
from django.db import transaction
from rest_framework.exceptions import ValidationError
from .models import Wallet, Transaction

class WalletService:
    @staticmethod
    def get_or_create_wallet(user):
        wallet, created = Wallet.objects.get_or_create(user=user)
        return wallet

    @staticmethod
    @transaction.atomic
    def deposit_funds(user, amount, phone_number):
        """
        Simulates an M-PESA Deposit.
        """
        wallet = WalletService.get_or_create_wallet(user)
        
        # Ensure we are working with Decimals
        amount = Decimal(str(amount))
        
        # 1. Create Transaction Record
        reference = f"MPS{uuid.uuid4().hex[:8].upper()}"
        txn = Transaction.objects.create(
            wallet=wallet,
            amount=amount,
            transaction_type=Transaction.Type.DEPOSIT,
            status=Transaction.Status.COMPLETED,
            reference=reference,
            description=f"Deposit via M-Pesa ({phone_number})"
        )

        # 2. Update Wallet Balance (Convert balance to Decimal first)
        current_balance = Decimal(str(wallet.balance))
        wallet.balance = current_balance + amount
        wallet.save()

        return txn

    @staticmethod
    @transaction.atomic
    def withdraw_funds(user, amount, phone_number):
        wallet = WalletService.get_or_create_wallet(user)
        
        # Ensure Decimals
        amount = Decimal(str(amount))
        current_balance = Decimal(str(wallet.balance))

        if current_balance < amount:
            raise ValidationError("Insufficient funds in wallet.")

        # 1. Deduct Balance
        wallet.balance = current_balance - amount
        wallet.save()

        # 2. Create Transaction Record
        reference = f"WTH{uuid.uuid4().hex[:8].upper()}"
        txn = Transaction.objects.create(
            wallet=wallet,
            amount=amount,
            transaction_type=Transaction.Type.WITHDRAWAL,
            status=Transaction.Status.COMPLETED,
            reference=reference,
            description=f"Withdrawal to {phone_number}"
        )

        return txn