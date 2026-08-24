from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    me,
    logout,
    register_email,
    request_login_code,
    EmailOrUsernameTokenObtainPairView,
    EmailCodeTokenObtainPairView,
    update_user
)


urlpatterns = [
    path("register/", register_email),
    path("submit_code/", EmailCodeTokenObtainPairView.as_view()),
    path("login/", EmailOrUsernameTokenObtainPairView.as_view()),
    path("login_with_code/", request_login_code),
    path("refresh/", TokenRefreshView.as_view()),
    path("me/", me),
    path("logout/", logout),
    path("update/", update_user),
]