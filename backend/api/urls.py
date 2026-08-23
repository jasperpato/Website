from django.urls import path
from .views import update_word, categories, words


urlpatterns = [
    path("words/", words),
    path("categories/", categories),
    path("words/<int:word_id>/", update_word),
]