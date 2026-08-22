from .models import Word


def add_word(word: str) -> Word:
    return Word.objects.create(word=word)