import requests
import json
import base64
from datetime import datetime
from django.conf import settings

class DarajaService:
    # SANDBOX URLs
    auth_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    stk_push_url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    # CREDENTIALS (In a real app, put these in settings.py or .env)
    consumer_key = 'hAsc0MzMloqAR7K4qWcWBYVgs7CwjcYs9PQriWHNlI9ZyGq0'  # <--- PASTE HERE
    consumer_secret = 'xIswACpJshxmCReHSylH1MMiRyoqrWApAD5gghwmKS1ZL0v2lKsAzILJsvhI7C3O' # <--- PASTE HERE
    shortcode = '174379' # Default Sandbox Paybill
    passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' # Default Sandbox Passkey

    def get_access_token(self):
        """Authenticate with Safaricom to get a token"""
        res = requests.get(self.auth_url, auth=(self.consumer_key, self.consumer_secret))
        return res.json()['access_token']

    def initiate_stk_push(self, phone_number, amount, account_reference):
        """Triggers the pop-up on the user's phone"""
        access_token = self.get_access_token()
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode((self.shortcode + self.passkey + timestamp).encode('ascii')).decode('utf-8')

        # Format phone: Must be 2547XXXXXXXX
        if phone_number.startswith('0'):
            phone_number = '254' + phone_number[1:]
        elif phone_number.startswith('+254'):
            phone_number = phone_number[1:]

        headers = { 'Authorization': f'Bearer {access_token}' }
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount), 
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": "https://jargonistic-unsubmitted-kyson.ngrok-free.dev/api/wallets/callback/",
            "AccountReference": account_reference,
            "TransactionDesc": "Escrow Deposit"
        }

        response = requests.post(self.stk_push_url, json=payload, headers=headers)
        return response.json()