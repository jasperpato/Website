from django.utils import timezone
from rest_framework import serializers
from .models import Category, Word


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "color"]

    def validate_name(self, value):
        if Category.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A category with this name already exists.")
        return value


class WordSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, allow_null=True
    )

    class Meta:
        model = Word
        fields = [
            "id", "word", "creator", "category", "category_id",
            "approved", "submitted_at", "approved_at",
            "reported", "reported_at",
        ]
        read_only_fields = ["submitted_at", "approved_at", "reported_at"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        is_staff = bool(
            request and request.user and request.user.is_authenticated and request.user.is_staff
        )
        if not is_staff:
            self.fields["approved"].read_only = True

    def create(self, validated_data):
        if validated_data.get("approved"):
            validated_data["approved_at"] = timezone.now()
        if validated_data.get("reported"):
            validated_data["reported_at"] = timezone.now()
        return super().create(validated_data)

    def to_internal_value(self, data):
        if isinstance(data, dict) and 'category_name' in data and 'category_id' not in data:
            data = {**data}
            name = data.pop('category_name')
            try:
                data['category_id'] = Category.objects.get(name__iexact=name).id
            except Category.DoesNotExist:
                raise serializers.ValidationError({'category_name': f"Category '{name}' not found"})
        return super().to_internal_value(data)

    def validate_word(self, value):
        queryset = Word.objects.filter(word__iexact=value)
        if self.instance is not None:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("This word already exists.")
        return value