from util import *
from itertools import batched


POST_BATCH_SIZE = 100


if __name__ == '__main__':
    data = read_json(DATA_DIR / "data.json")

    existing_words = {w["word"].lower() for w in fetch("/api/words/") or []}
    existing_categories = {c["name"].lower() for c in fetch("/api/categories/") or []}

    print(existing_categories)
    print(existing_words)

    auth = AuthSession()

    for category_name, category_data in data.items():
        color: str = category_data["color"]
        words: list = [w for w in category_data["words"] if w.lower() not in existing_words]

        if category_name.lower() not in existing_categories:
            request(
                url_suffix="/api/categories/",
                data={ "name": category_name, "color": color },
                auth=auth
            )

        for word_batch in batched(words, POST_BATCH_SIZE):
            batch_data = [{ "word": w, "category_name": category_name, "approved": True } for w in word_batch]

            request(
                url_suffix="/api/words/",
                data=batch_data,
                auth=auth
            )

    
    