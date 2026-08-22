from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=255)

    class Meta:
        db_table = "categories"


class Word(models.Model):
    word = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="words")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="words")
    approved = models.BooleanField(default=False)

    class Meta:
        db_table = "words"


class EmailVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="email_verification")
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "email_verifications"

    def is_expired(self):
        return timezone.now() > self.created_at + timezone.timedelta(minutes=10)