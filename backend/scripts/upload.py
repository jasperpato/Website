from itertools import batched
from util import *


if __name__ == '__main__':
    categories = read_json(DATA_DIR / "categories.json")
    words = read_json(DATA_DIR / "words.json")

    auth = AuthSession(ENV["ADMIN_EMAIL"], ENV["ADMIN_PASSWORD"])

    for name, color in categories.items():
        request(
            url_suffix="/api/categories/",
            data={ "name": name, "color": color },
            auth=auth
        )

    words_list = [{ "word": word, "category_name": category } for category, category_list in words.items() for word in category_list]

    for words_batch in batched(words_list, POST_BATCH_SIZE):
        request(
            url_suffix="/api/words/",
            data=list(words_batch),
            auth=auth
        )

    fetched_words = fetch("/api/words")

    for word in words_list:
        fetched_word = None
        for w in fetched_words:
            if w["word"].lower() == word["word"].lower():
                fetched_word = w

        if fetched_word:
            request(
                url_suffix=f"/api/words/{fetched_word['id']}/",
                data={ 'approved': True },
                auth=auth,
                method = "PATCH"
            )

        else:
            print(word, fetched_word)

    
    