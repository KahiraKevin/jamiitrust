from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Configure API Documentation with JWT Support
schema_view = get_schema_view(
   openapi.Info(
      title="Jamii Trust API",
      default_version='v1',
      description="API for Jamii Trust Escrow System",
      contact=openapi.Contact(email="admin@jamiitrust.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Enable the "Log in" button in the Browsable API
    path('api-auth/', include('rest_framework.urls')),
    
    # Auth Routes
    path('api/auth/', include('apps.users.urls')),
    
    # Wallet Routes (e.g., api/wallets/)
    path('api/wallets/', include('apps.wallets.urls')),

    # 👇 FIXED LINE: Remove 'projects/' from here so the router can define it
    # This allows:
    #   1. api/projects/
    #   2. api/milestones/
    path('api/', include('apps.projects.urls')), 

    path('api/disputes/', include('apps.disputes.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    
    # Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)