from django.db.models.functions import Lower
from django.utils import timezone
from rest_framework import serializers
from .models import Category, Word


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "color", "order"]

    def validate_name(self, value):
        if Category.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A category with this name already exists.")
        return value


class WordListSerializer(serializers.ListSerializer):
    def to_internal_value(self, data):
        if isinstance(data, list):
            names = {item["category_name"] for item in data if isinstance(item, dict) and item.get("category_name")}
            if names:
                categories = Category.objects.annotate(lower_name=Lower("name")).filter(lower_name__in=[n.lower() for n in names])
                self.child.category_cache = {c.lower_name: c.id for c in categories}

            words = [item["word"] for item in data if isinstance(item, dict) and item.get("word")]
            lower_words = [w.lower() for w in words]
            seen = set()
            for w in lower_words:
                if w in seen:
                    raise serializers.ValidationError({"word": f"Duplicate word '{w}' in batch"})
                seen.add(w)

            if words:
                self.child.existing_words_cache = set(
                    Word.objects.annotate(lower_word=Lower("word"))
                    .filter(lower_word__in=lower_words)
                    .values_list("lower_word", flat=True)
                )

        return super().to_internal_value(data)

    def create(self, validated_data):
        now = timezone.now()
        instances = []
        for attrs in validated_data:
            if attrs.get("approved"):
                attrs["approved_at"] = now
            if attrs.get("reported"):
                attrs["reported_at"] = now
            instances.append(Word(**attrs))
        return Word.objects.bulk_create(instances)


class WordSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, allow_null=True
    )

    class Meta:
        model = Word
        list_serializer_class = WordListSerializer
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
            cache = getattr(self, 'category_cache', None)
            if cache is not None:
                category_id = cache.get(name.lower())
                if category_id is None:
                    raise serializers.ValidationError({'category_name': f"Category '{name}' not found"})
                data['category_id'] = category_id
            else:
                try:
                    data['category_id'] = Category.objects.get(name__iexact=name).id
                except Category.DoesNotExist:
                    raise serializers.ValidationError({'category_name': f"Category '{name}' not found"})
        return super().to_internal_value(data)

    def validate_word(self, value):
        cache = getattr(self, 'existing_words_cache', None)
        if cache is not None:
            exists = value.lower() in cache
        else:
            queryset = Word.objects.filter(word__iexact=value)
            if self.instance is not None:
                queryset = queryset.exclude(pk=self.instance.pk)
            exists = queryset.exists()
        if exists:
            raise serializers.ValidationError("This word already exists.")
        return value