from django.contrib import admin
from .models import Category, Word

class WordAdmin(admin.ModelAdmin):
    list_display = ["word"]

admin.site.register(Category)
admin.site.register(Word, WordAdmin)
