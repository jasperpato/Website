from django.db import models
from django.db.models.functions import Lower
from django.utils import timezone
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=255)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = "categories"
        ordering = ["order", "name"]
        constraints = [
            models.UniqueConstraint(Lower("name"), name="category_name_ci_unique")
        ]

    def __str__(self):
        return self.name


class Word(models.Model):
    word = models.CharField(max_length=255)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="words")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="words")

    submitted_at = models.DateTimeField(auto_now_add=True)

    approved = models.BooleanField(null=True, default=None)
    approved_at = models.DateTimeField(null=True, blank=True, default=None)

    reported = models.BooleanField(default=False)
    reported_at = models.DateTimeField(null=True, blank=True, default=None)

    class Meta:
        db_table = "words"
        constraints = [
            models.UniqueConstraint(Lower("word"), name="word_word_ci_unique")
        ]


class Feedback(models.Model):
    name = models.CharField(max_length=255)
    message = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="feedback")
    public = models.BooleanField(default=False)
    addressed = models.BooleanField(default=False)

    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "feedback"
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.name}: {self.message[:50]}"

