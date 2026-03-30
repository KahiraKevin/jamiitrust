from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'role', 'first_name', 'last_name', 'phone_number')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'BUYER'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', '')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    # 1. Available Balance (Spendable)
    wallet_balance = serializers.DecimalField(
        source='wallet.balance', 
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )

    # 2. 👇 NEW: Escrow Balance (Locked in Jobs)
    escrow_balance = serializers.DecimalField(
        source='wallet.escrow_balance', 
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )

    class Meta:
        model = User
        # 👇 Added 'escrow_balance' to this list
        fields = ('id', 'email', 'role', 'first_name', 'last_name', 'phone_number', 'is_verified', 'wallet_balance', 'escrow_balance')