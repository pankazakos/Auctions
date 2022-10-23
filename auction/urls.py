"""auction URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from base.views import front, items, users
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView

from api.views import MyTokenObtainPairView
import os
from pathlib import Path
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("", front),
    re_path(r'^favicon\.ico$', RedirectView.as_view(
        url=staticfiles_storage.path(os.path.join(Path(__file__).resolve().parent.parent.parent, 'code/static/favicon.ico')))),
    path("Browse/", front),
    path("Browse/item/<int:id>/", items), 
    path("Manage/", front),
    path("SignUp/", front),
    path("SignUp/Pending/", front),
    path("MyAdmin/", front),
    path("MyAdmin/ApproveUsers", front),
    path("MyAdmin/ListUsers/", front),
    path("MyAdmin/ListUsers/<str:username>", users),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
