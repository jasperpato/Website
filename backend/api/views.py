from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status

from .models import Category, Word
from .serializers import CategorySerializer, WordSerializer

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class IsStaff(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

def is_staff(user) -> bool:
    return user.is_authenticated and user.is_staff


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def categories(request: Request) -> Response:
    if request.method == "GET":
        serializer = CategorySerializer(Category.objects.all(), many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if not is_staff(request.user):
            return Response({"error": "staff permission required"}, status=status.HTTP_403_FORBIDDEN)

        serializer = CategorySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def words(request: Request) -> Response:
    if request.method == "GET":
        serializer = WordSerializer(Word.objects.filter(approved=True), many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if not request.user.is_authenticated:
            return Response({"error": "authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        many = isinstance(request.data, list)
        items = request.data if many else [request.data]

        allowed_fields = {"word", "category_id", "category_name"}
        if is_staff(request.user):
            allowed_fields |= {"approved", "reported"}

        for item in items:
            if set(item.keys()) - allowed_fields:
                return Response(
                    {"error": "only word and category may be set"},
                    status=status.HTTP_403_FORBIDDEN,
                )

        serializer = WordSerializer(data=request.data, many=many, context={"request": request})

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(creator=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([AllowAny])
def update_word(request, word_id):
    try:
        word = Word.objects.get(id=word_id)
    except Word.DoesNotExist:
        return Response({"error": "word not found"}, status=status.HTTP_404_NOT_FOUND)

    non_reported_fields = set(request.data.keys()) - {"reported"}
    if non_reported_fields and not is_staff(request.user):
        return Response({"error": "staff permission required"}, status=status.HTTP_403_FORBIDDEN)

    if "approved" in request.data:
        word.approved = request.data["approved"] == True
        word.approved_at = timezone.now() if word.approved else None

    if "word" in request.data:
        word.word = request.data["word"]

    if "reported" in request.data:
        word.reported = request.data["reported"] == True
        word.reported_at = timezone.now() if word.reported else None

    serializer = WordSerializer(word, data=request.data, partial=True, context={"request": request})

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save()
    return Response(serializer.data)
