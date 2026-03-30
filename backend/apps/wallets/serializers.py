from rest_framework import serializers
from .models import Wallet, Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'transaction_type', 'status', 'reference', 'description', 'created_at']

class WalletSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = ['id', 'balance', 'currency', 'transactions']

class DepositSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=1.00)
    phone_number = serializers.CharField(max_length=15, help_text="Format: 2547XXXXXXXX")

class WithdrawSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=1.00)
    phone_number = serializers.CharField(max_length=15)