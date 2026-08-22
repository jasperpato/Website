from django.contrib.auth.models import User
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=255)
    color_hex = models.CharField(max_length=7)

    class Meta:
        db_table = "categories"


class Word(models.Model):
    word = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="words")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="words")
    approved = models.BooleanField(null=True, default=None)

    class Meta:
        db_table = "words"