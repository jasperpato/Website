from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import categories, register, verify, words


urlpatterns = [
    path("auth/register/", register),
    path("auth/verify/", verify),
    path("auth/login/", TokenObtainPairView.as_view()),
    path("auth/refresh/", TokenRefreshView.as_view()),
    path("words/", words),
    path("categories/", categories),
]