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


class IsStaff(BasePermission):
    def has_permission(self, request: Request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


@api_view(["GET"])
def categories(request: Request) -> Response:
    serializer = CategorySerializer(Category.objects.all(), many=True)
    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def words(request: Request) -> Response:
    if request.method == "POST" and not request.user.is_authenticated:
        return Response({"error": "authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        limit = int(request.query_params.get("limit", 100))
        sorted_by = request.query_params.get("sorted_by", "alphabetical")
        ascending = request.query_params.get("ascending", "true").lower() != "false"
        approved_only = request.query_params.get("approved_only", "false").lower() == "true"

        qs = Word.objects.all()

        if approved_only:
            qs = qs.filter(approved=True)

        sort_map = {
            "alphabetical": "word",
            "submitted_at": "submitted_at",
            "approved_at": "approved_at",
            "category": "category__name",
        }

        if sorted_by == "random":
            qs = qs.order_by("?")
        else:
            field = sort_map.get(sorted_by, "word")
            qs = qs.order_by(field if ascending else f"-{field}")

        serializer = WordSerializer(qs[:limit], many=True)
        return Response(serializer.data)

    serializer = WordSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    word = serializer.validated_data["word"]
    
    if not word.strip():
        return Response({"error": "word is required"}, status=status.HTTP_400_BAD_REQUEST)

    serializer.save(creator=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([IsStaff])
def update_word(request, word_id):
    try:
        word = Word.objects.get(id=word_id)
    except Word.DoesNotExist:
        return Response({"error": "word not found"}, status=status.HTTP_404_NOT_FOUND)

    if "approved" in request.data:
        word.approved = request.data["approved"]
        word.approved_at = timezone.now() if request.data["approved"] is True else None

    serializer = WordSerializer(word, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    return Response(serializer.data)
