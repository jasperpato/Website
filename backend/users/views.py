import random
import resend
from resend.exceptions import ValidationError
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes, throttle_scope
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from .models import EmailVerification

from rest_framework.request import Request
from rest_framework.response import Response

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db.models import Q
from rest_framework import exceptions
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView


resend.api_key = settings.RESEND_API_KEY


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get(self.username_field)

        try:
            user = get_user_model().objects.get(Q(email=identifier) | Q(username=identifier))
        except get_user_model().DoesNotExist:
            user = None

        if user is not None:
            attrs[self.username_field] = user.email

        return super().validate(attrs)


class EmailOrUsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer
    throttle_scope = "auth_login"


class EmailCodeTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["password"].required = False

    def validate(self, attrs):
        email = attrs.get(self.username_field)
        code = self.initial_data.get("code", "")

        try:
            user = get_user_model().objects.get(email=email)
            verification = user.email_verification
        except (get_user_model().DoesNotExist, EmailVerification.DoesNotExist):
            raise exceptions.AuthenticationFailed("invalid code")

        if verification.is_expired() or verification.code != code:
            raise exceptions.AuthenticationFailed("invalid code")

        user.is_active = True
        user.save()
        verification.delete()

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class EmailCodeTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailCodeTokenObtainPairSerializer
    throttle_scope = "auth_code"


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_scope("auth_code")
def register_email(request: Request) -> Response:
    email = request.data.get("email", "").strip()

    if not email:
        return Response({"error": "email is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = get_user_model().objects.get(email=email)

        if user.is_active:
            return Response({"error": "User with that email exists"}, status=status.HTTP_409_CONFLICT)

    except get_user_model().DoesNotExist:
        user = get_user_model().objects.create_user(email=email, is_active=False)

    code = f"{random.randint(0, 999999):06d}"

    EmailVerification.objects.update_or_create(user=user, defaults={"code": code})

    try:
        resend.Emails.send({
            "from": settings.RESEND_FROM,
            "to": email,
            "subject": "Your verification code",
            "html": f"<p>Your verification code is <strong>{code}</strong>. It expires in 10 minutes.</p>",
        })
    except ValidationError:
        Response({"error": "email is invalid"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "verification code sent"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_scope("auth_code")
def request_login_code(request: Request) -> Response:
    email = request.data.get("email", "").strip()

    if not email:
        return Response({"error": "email is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = get_user_model().objects.get(email=email)
    except get_user_model().DoesNotExist:
        return Response({"error": "user does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    code = f"{random.randint(0, 999999):06d}"

    EmailVerification.objects.update_or_create(user=user, defaults={"code": code})

    resend.Emails.send({
        "from": settings.RESEND_FROM,
        "to": email,
        "subject": "Your verification code",
        "html": f"<p>Your verification code is <strong>{code}</strong>. It expires in 10 minutes.</p>",
    })

    return Response({"message": "verification code sent"}, status=status.HTTP_201_CREATED)


def _get_user_response(user):
    return Response({
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "is_staff": user.is_staff,
    })


@api_view(["GET"])
def me(request: Request) -> Response:
    return _get_user_response(request.user)


@api_view(["POST"])
def logout(request: Request) -> Response:
    refresh_token = request.data.get("refresh", "")

    if not refresh_token:
        return Response({"error": "refresh is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        RefreshToken(refresh_token).blacklist()
    except TokenError:
        return Response({"error": "invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_205_RESET_CONTENT)


@api_view(["PATCH"])
def update_user(request: Request) -> Response:
    user = request.user

    if "username" in request.data:
        username = request.data.get("username", "").strip()

        if not username:
            return Response({"error": "username is required"}, status=status.HTTP_400_BAD_REQUEST)

        if get_user_model().objects.exclude(pk=user.pk).filter(username=username).exists():
            return Response({"error": "username is already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user.username = username

    if "password" in request.data:
        password = request.data.get("password", "").strip()

        if not password:
            return Response({"error": "password is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password, user=user)
        except ValidationError as exc:
            return Response({"error": exc.messages}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)

    user.save()

    return _get_user_response(user)