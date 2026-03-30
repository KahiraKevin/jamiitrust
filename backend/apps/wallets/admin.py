from django.contrib import admin
from .models import Wallet, Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('reference', 'wallet', 'transaction_type', 'amount', 'created_at')
    list_filter = ('transaction_type',)
    search_fields = ('reference', 'wallet__user__email')

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'currency')