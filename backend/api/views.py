from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Word
from .serializers import WordSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()
    if not username or not password:
        return Response({"error": "username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"error": "username already taken"}, status=status.HTTP_400_BAD_REQUEST)
    User.objects.create_user(username=username, password=password)
    return Response({"message": "user created"}, status=status.HTTP_201_CREATED)


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
