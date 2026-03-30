from django.contrib import admin
from .models import Dispute

@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    # What columns to show in the list
    list_display = ('id', 'milestone', 'initiator', 'status', 'created_at')
    
    # Enable filtering by status (Open/Resolved)
    list_filter = ('status', 'created_at')
    
    # Add a search bar to find disputes by email or description
    search_fields = ('reason', 'initiator__email', 'milestone__description')
    
    # Make the list read-only mainly, but allow status updates
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('milestone', 'initiator', 'reason', 'status')
        }),
        ('Resolution', {
            'fields': ('resolution_notes',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )