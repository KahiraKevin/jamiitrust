from django.urls import path
from .views import WalletDetailView, DepositView, WithdrawView, MpesaCallbackView

urlpatterns = [
    path('me/', WalletDetailView.as_view(), name='wallet-detail'),
    path('deposit/', DepositView.as_view(), name='wallet-deposit'),
    path('withdraw/', WithdrawView.as_view(), name='wallet-withdraw'),
    path('callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
]