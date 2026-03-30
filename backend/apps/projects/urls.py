from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, MilestoneViewSet

router = DefaultRouter()

# 👇 Explicitly name the routes here
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'milestones', MilestoneViewSet, basename='milestones')

urlpatterns = [
    path('', include(router.urls)),
]