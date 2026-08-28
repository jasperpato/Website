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

def request(url_suffix: str, data: dict, auth: "AuthSession | None" = None, method: str = "POST"):
    method = method.upper()

    def send():
        headers = {"Authorization": f"Bearer {auth.access_token}"} if auth else None
        res = (requests.post if method == "POST" else requests.patch)(
            url = f'{ENV["URL"].rstrip("/")}/{url_suffix.strip("/")}/',
            json=data,
            headers=headers,
        )
        res.raise_for_status()
        return res

    try:
        try:
            res = send()
        except requests.HTTPError as e:
            if auth and e.response is not None and e.response.status_code == 401:
                auth.refresh()
                res = send()
            else:
                raise

    except Exception as e:
        # for now
        # if method == "PATCH":
        #     data_str = str(data)
        #     print(f"Error {method.lower()}ing {{ data: ${data_str[:DATA_MAX_PRINT_LENGTH]}{"..." if len(data_str) > DATA_MAX_PRINT_LENGTH else ""} }}: {e}")

        print(f"{method.capitalize()} failed for for {data}: {e}")

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


class AuthSession:
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password
        self.access_token = None
        self.refresh_token = None
        self.login()

    def login(self):
        data = request("/auth/login/", { "email": self.email, "password": self.password })
        self.access_token = data["access"]
        self.refresh_token = data["refresh"]

    def refresh(self):
        data = request("/auth/refresh/", { "refresh": self.refresh_token })
        if data:
            self.access_token = data["access"]
            if "refresh" in data:
                self.refresh_token = data["refresh"]
        else:
            self.login()
