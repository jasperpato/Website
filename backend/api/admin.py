import json

from django.contrib import admin
from django.db.models import Count
from django.http import HttpResponse
from django.utils import timezone

from .models import Category, Feedback, Word


@admin.action(description="Approve selected words")
def approve_words(modeladmin, request, queryset):
    queryset.update(approved=True, approved_at=timezone.now())


@admin.action(description="Export selected words to JSON")
def export_words_json(modeladmin, request, queryset):
    data = {}
    words = queryset.exclude(approved=False).select_related("category").order_by("category__name", "word")
    for word in words:
        if word.category:
            category_name = word.category.name
            color = word.category.color
        else:
            category_name = "Uncategorized"
            color = None

        category_data = data.setdefault(category_name, {"color": color, "words": []})
        category_data["words"].append(word.word)

    response = HttpResponse(json.dumps(data, indent=2), content_type="application/json")
    response["Content-Disposition"] = "attachment; filename=data.json"
    return response


class WordAdmin(admin.ModelAdmin):
    list_display = ["word", "category", "creator", "approved", "submitted_at", "approved_at", "reported", "reported_at"]
    list_filter = ["category", "approved"]
    search_fields = ["word", "creator__email", "category__name"]
    date_hierarchy = "submitted_at"
    actions = [approve_words, export_words_json]


class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "color", "card_order", "board_order", "word_count"]
    list_editable = ["card_order", "board_order"]
    search_fields = ["name"]

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_word_count=Count("words"))

    @admin.display(description="Words", ordering="_word_count")
    def word_count(self, obj):
        return obj._word_count


class FeedbackAdmin(admin.ModelAdmin):
    list_display = ["name", "message", "user", "public", "addressed", "submitted_at"]
    list_filter = ["public", "addressed"]
    list_editable = ["public", "addressed"]
    search_fields = ["name", "message", "user__email"]
    date_hierarchy = "submitted_at"


admin.site.register(Category, CategoryAdmin)
admin.site.register(Word, WordAdmin)
admin.site.register(Feedback, FeedbackAdmin)
