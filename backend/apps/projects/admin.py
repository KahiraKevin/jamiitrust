from django.contrib import admin
from .models import Project, Milestone

class MilestoneInline(admin.TabularInline):
    model = Milestone
    extra = 0

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'buyer', 'seller', 'status', 'created_at')
    inlines = [MilestoneInline]

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ('description', 'project', 'amount', 'status', 'auto_release_date')
    list_filter = ('status',)