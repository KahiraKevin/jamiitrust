from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project, Milestone
from apps.users.serializers import UserSerializer

User = get_user_model()

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'description', 'amount', 'status', 'submitted_at', 'auto_release_date']
        read_only_fields = ['id', 'status', 'submitted_at', 'auto_release_date']

class ProjectReadSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    seller = UserSerializer(read_only=True)
    milestones = MilestoneSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'budget', 'status', 'buyer', 'seller', 'milestones', 'created_at']

class ProjectCreateSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True)
    
    # ✅ FIX 1: Rename to 'freelancer_email' to match Frontend
    freelancer_email = serializers.EmailField(write_only=True, required=True) 
    
    # ✅ FIX 2: Add 'budget' so the View can validate funds!
    budget = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)

    class Meta:
        model = Project
        # Ensure 'budget' and 'freelancer_email' are in fields
        fields = ['id', 'title', 'description', 'budget', 'milestones', 'freelancer_email']

    def create(self, validated_data):
        # Extract fields that don't belong to the Project model directly
        milestones_data = validated_data.pop('milestones')
        email = validated_data.pop('freelancer_email', None) # Remove it so it doesn't crash .create()
        
        # Note: The View passes 'buyer' and 'seller' automatically via serializer.save()
        # So we just create the project with the remaining data
        project = Project.objects.create(**validated_data)
        
        # Create Milestones
        for milestone_data in milestones_data:
            Milestone.objects.create(project=project, **milestone_data)
            
        return project