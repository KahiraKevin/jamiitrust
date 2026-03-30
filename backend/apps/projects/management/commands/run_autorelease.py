from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.projects.models import Milestone
from apps.projects.services import EscrowService

class Command(BaseCommand):
    help = 'Checks for expired milestones and auto-releases funds.'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        self.stdout.write(f"⏰ Checking for expired milestones at {now}...")

        # Find milestones that are SUBMITTED and passed their release date
        expired_milestones = Milestone.objects.filter(
            status=Milestone.Status.SUBMITTED,
            auto_release_date__lte=now
        )

        count = 0
        for milestone in expired_milestones:
            try:
                self.stdout.write(f"   > Releasing Milestone: {milestone.id} ({milestone.description})")
                EscrowService.release_milestone(user=None, milestone_id=milestone.id)
                count += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"   X Failed to release {milestone.id}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"✅ Auto-release complete. Released {count} milestones."))