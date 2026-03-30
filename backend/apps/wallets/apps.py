from django.apps import AppConfig

class WalletsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.wallets'
    verbose_name = 'Wallet & Transactions'

    def ready(self):
        # We will add signals later to auto-create wallets for new users
        pass