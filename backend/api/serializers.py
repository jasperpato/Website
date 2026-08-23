from rest_framework import serializers
from .models import Category, Word


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "color"]


class WordSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, allow_null=True
    )

    class Meta:
        model = Word
        fields = ["id", "word", "creator", "category", "category_id", "approved", "submitted_at", "approved_at"]
        read_only_fields = ["approved", "submitted_at", "approved_at"]