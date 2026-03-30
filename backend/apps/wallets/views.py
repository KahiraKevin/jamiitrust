import json
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Wallet, Transaction
from .serializers import WalletSerializer, DepositSerializer, WithdrawSerializer
from .services import WalletService
from .daraja import DarajaService

class WalletDetailView(generics.RetrieveAPIView):
    """
    Get the current user's wallet balance and history.
    """
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return WalletService.get_or_create_wallet(self.request.user)

class DepositView(APIView):
    """
    Triggers an M-PESA STK Push to the user's phone and saves a PENDING transaction.
    """
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(request_body=DepositSerializer)
    def post(self, request):
        serializer = DepositSerializer(data=request.data)
        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            phone = serializer.validated_data['phone_number']
            
            # 1. Initialize Daraja Service
            daraja = DarajaService()
            
            try:
                # 2. Trigger STK Push
                account_ref = f"USER_{request.user.id}" 
                response = daraja.initiate_stk_push(phone, amount, account_ref)
                
                # 3. Check if Safaricom accepted the request
                if response.get('ResponseCode') == '0':
                    checkout_id = response.get('CheckoutRequestID')

                    # 👇 IMPORTANT: Create a PENDING transaction record
                    # We need this 'checkout_id' to match the callback later!
                    Transaction.objects.create(
                        wallet=WalletService.get_or_create_wallet(request.user),
                        amount=amount,
                        transaction_type='DEPOSIT',
                        status='PENDING',
                        reference=checkout_id, 
                        description=f"M-PESA Deposit via {phone}"
                    )

                    return Response({
                        "message": "STK Push sent! Please check your phone and enter your PIN.",
                        "checkout_request_id": checkout_id,
                        "status": "pending_confirmation" 
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        "error": "Safaricom refused the request",
                        "details": response.get('errorMessage', 'Unknown error')
                    }, status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response({"error": f"Connection Error: {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class MpesaCallbackView(APIView):
    """
    Endpoint that Safaricom hits to confirm payment.
    Requires NGROK to be reachable from the internet.
    """
    permission_classes = [permissions.AllowAny] 

    def post(self, request):
        print("\n📩 --- MPESA CALLBACK RECEIVED ---")
        # print(json.dumps(request.data, indent=2)) # Uncomment to debug raw data
        
        try:
            body = request.data.get('Body', {}).get('stkCallback', {})
            result_code = body.get('ResultCode')
            checkout_id = body.get('CheckoutRequestID') # This matches the 'reference' we saved earlier
            result_desc = body.get('ResultDesc')

            try:
                # 1. Find the Pending Transaction by Checkout ID
                transaction = Transaction.objects.get(reference=checkout_id)
            except Transaction.DoesNotExist:
                print(f"❌ ERROR: Transaction not found for ID: {checkout_id}")
                return Response({"status": "ignored"}, status=status.HTTP_200_OK)

            # 2. Handle Success (ResultCode 0 = Success)
            if result_code == 0:
                if transaction.status == 'PENDING':
                    # Extract Receipt Number (e.g., QKH123456)
                    meta_data = body.get('CallbackMetadata', {}).get('Item', [])
                    receipt_number = next((item['Value'] for item in meta_data if item['Name'] == 'MpesaReceiptNumber'), "N/A")
                    
                    # Update Transaction
                    transaction.status = 'COMPLETED'
                    transaction.description = f"Completed: {receipt_number}"
                    transaction.save()
                    
                    # Credit Wallet
                    wallet = transaction.wallet
                    wallet.balance += transaction.amount
                    wallet.save()
                    
                    print(f"✅ PAYMENT SUCCESS: {transaction.amount} KES added to {wallet.user.email}")
                else:
                    print("⚠️ Transaction was already processed.")

            # 3. Handle Failure (User Cancelled, Insufficient Funds, etc.)
            else:
                print(f"❌ Payment Failed: {result_desc}")
                transaction.status = 'FAILED'
                transaction.description = f"Failed: {result_desc}"
                transaction.save()

            return Response({"status": "received"}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"🔥 CRITICAL ERROR in Callback: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_200_OK)


class WithdrawView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(request_body=WithdrawSerializer)
    def post(self, request):
        serializer = WithdrawSerializer(data=request.data)
        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            phone = serializer.validated_data['phone_number']
            
            try:
                txn = WalletService.withdraw_funds(request.user, amount, phone)
                return Response({
                    "message": "Withdrawal successful",
                    "new_balance": WalletService.get_or_create_wallet(request.user).balance,
                    "transaction_ref": txn.reference
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)