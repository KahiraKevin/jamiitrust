from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Milestone
from apps.notifications.models import Notification

@receiver(pre_save, sender=Milestone)
def track_milestone_status_change(sender, instance, **kwargs):
    # We need to know the OLD status to compare
    if instance.id:
        try:
            old_instance = Milestone.objects.get(id=instance.id)
            instance._old_status = old_instance.status
        except Milestone.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None

@receiver(post_save, sender=Milestone)
def notify_milestone_change(sender, instance, created, **kwargs):
    if created:
        return # Don't notify on creation, only on status updates

    old_status = getattr(instance, '_old_status', None)
    new_status = instance.status

    if old_status == new_status:
        return

    buyer = instance.project.buyer
    seller = instance.project.seller
    project_title = instance.project.title

    # 1. FUNDED: Notify Seller
    if new_status == Milestone.Status.FUNDED and seller:
        title = "Funds Secured!"
        msg = f"Buyer {buyer.first_name} has funded '{instance.description}' for KES {instance.amount}. You can start working."
        create_alert(seller, title, msg)

    # 2. SUBMITTED: Notify Buyer
    elif new_status == Milestone.Status.SUBMITTED:
        title = "Work Submitted"
        msg = f"Seller {seller.first_name} submitted work for '{instance.description}'. Please review and approve."
        create_alert(buyer, title, msg)

    # 3. PAID: Notify Seller
    elif new_status == Milestone.Status.PAID and seller:
        title = "Payment Released"
        msg = f"Great news! KES {instance.amount} has been released to your wallet for '{project_title}'."
        create_alert(seller, title, msg)

    # 4. DISPUTED: Notify Both
    elif new_status == Milestone.Status.DISPUTED:
        create_alert(buyer, "Dispute Raised", f"A dispute was raised on '{instance.description}'. Funds are frozen.")
        if seller:
            create_alert(seller, "Dispute Raised", f"A dispute was raised on '{instance.description}'. Funds are frozen.")

def create_alert(user, title, message):
    # 1. In-App Notification
    Notification.objects.create(recipient=user, title=title, message=message)
    
    # 2. Email Notification (Console)
    print(f"📧 [EMAIL SIMULATION] To: {user.email} | Subject: {title} | Body: {message}")