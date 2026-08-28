from util import *
from itertools import batched


POST_BATCH_SIZE = 500


if __name__ == '__main__':
    data = read_json(DATA_DIR / "data.json")

    auth = AuthSession(ENV["ADMIN_EMAIL"], ENV["ADMIN_PASSWORD"])

    for category_name, category_data in data.items():
        color: str = category_data["color"]
        words: list = category_data["words"]

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

    
    