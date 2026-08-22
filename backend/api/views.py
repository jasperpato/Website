import random
import resend
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Category, EmailVerification, Word
from .serializers import CategorySerializer, WordSerializer

resend.api_key = settings.RESEND_API_KEY


def _issue_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()
    if not username or not password:
        return Response({"error": "username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"error": "username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, is_active=False)
    code = f"{random.randint(0, 999999):06d}"
    EmailVerification.objects.update_or_create(user=user, defaults={"code": code})

    resend.Emails.send({
        "from": settings.RESEND_FROM,
        "to": username,
        "subject": "Your verification code",
        "html": f"<p>Your verification code is <strong>{code}</strong>. It expires in 10 minutes.</p>",
    })

    return Response({"message": "verification code sent"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def verify(request):
    username = request.data.get("username", "").strip()
    code = request.data.get("code", "").strip()
    try:
        user = User.objects.get(username=username)
        verification = user.email_verification
    except (User.DoesNotExist, EmailVerification.DoesNotExist):
        return Response({"error": "invalid code"}, status=status.HTTP_400_BAD_REQUEST)

    if verification.is_expired():
        return Response({"error": "code expired"}, status=status.HTTP_400_BAD_REQUEST)
    if verification.code != code:
        return Response({"error": "invalid code"}, status=status.HTTP_400_BAD_REQUEST)

    user.is_active = True
    user.save()
    verification.delete()

    return Response(_issue_tokens(user))


@api_view(["GET"])
def categories(request):
    serializer = CategorySerializer(Category.objects.all(), many=True)
    return Response(serializer.data)


@api_view(["GET", "POST"])
def words(request):
    if request.method == "GET":
        serializer = WordSerializer(Word.objects.all(), many=True)
        return Response(serializer.data)

    serializer = WordSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    word = serializer.validated_data["word"]
    if not word.strip():
        return Response({"error": "word is required"}, status=status.HTTP_400_BAD_REQUEST)

    serializer.save(creator=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
