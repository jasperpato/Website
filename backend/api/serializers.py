from rest_framework import serializers
from .models import Category, Word


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "color_hex"]


class WordSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Word
        fields = ["id", "word", "creator", "category", "approved"]
        read_only_fields = ["approved"]