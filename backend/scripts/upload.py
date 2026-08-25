import requests
import json
from pathlib import Path
from dotenv import dotenv_values
from itertools import batched


BACKEND_DIR = Path(__file__).parent.parent
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR / "data"

POST_BATCH_SIZE = 100
DATA_MAX_PRINT_LENGTH = 50

ENV = dotenv_values(BACKEND_DIR / ".env")

def read_json(filename: str):
    with open(filename, 'r') as f:
        return json.load(f)

def request(url_suffix: str, data: dict, access_token: str | None = None, method: str = "POST"):
    method = method.upper()
    headers = {"Authorization": f"Bearer {access_token}"} if access_token else None

    try:
        res = (requests.post if method == "POST" else requests.patch)(
            url = f'{ENV["URL"].rstrip("/")}/{url_suffix.strip("/")}/',
            json=data,
            headers=headers,
        )

        res.raise_for_status()

    except Exception as e:
        # for now
        if method == "PATCH":
            data_str = str(data)
            print(f"Error {method.lower()}ing {{ data: ${data_str[:DATA_MAX_PRINT_LENGTH]}{"..." if len(data_str) > DATA_MAX_PRINT_LENGTH else ""} }}: {e}")
        return None

    return res.json()


def fetch(url_suffix: str):
    try:
        res = requests.get(f'{ENV["URL"].rstrip("/")}/{url_suffix.strip("/")}/')
        res.raise_for_status()

    except Exception as e:
        print(f"Error fetching: /{url_suffix.strip('/')}/")
        return None

    return res.json()


def get_access_token(email, password):
    data = request("/auth/login/", { "email": email, "password": password })
    return data["access"]


if __name__ == '__main__':
    categories = read_json(DATA_DIR / "categories.json")
    words = read_json(DATA_DIR / "words.json")

    access_token = get_access_token(ENV["ADMIN_EMAIL"], ENV["ADMIN_PASSWORD"])

    # for name, color in categories.items():
    #     request(
    #         url_suffix="/api/categories/",
    #         data={ "name": name, "color": color },
    #         access_token=access_token
    #     )

    words_list = [{ "word": word, "category_name": category } for category, category_list in words.items() for word in category_list]

    # for words_batch in batched(words_list, POST_BATCH_SIZE):
    #     request(
    #         url_suffix="/api/words/",
    #         data=list(words_batch),
    #         access_token=access_token
    #     )

    fetched_words = fetch("/api/words")
    # print(fetched_words)

    for word in words_list:
        fetched_word = None
        for w in fetched_words:
            if w["word"].lower() == word["word"].lower():
                fetched_word = w

        if fetched_word:
            request(
                url_suffix=f"/api/words/{fetched_word['id']}/",
                data={ 'approved': True },
                access_token=access_token,
                method = "PATCH"
            )

        else:
            print(word, fetched_word)

    
    