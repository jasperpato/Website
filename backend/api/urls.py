from django.urls import path
from .views import update_word, categories, words, feedback


urlpatterns = [
    path("categories/", categories),
    path("words/", words),
    path("words/<int:word_id>/", update_word),
    path("feedback/", feedback),
]