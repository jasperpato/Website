import io
import sys
import time

import pytesseract
import requests
from PIL import Image
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

from util import *

# pip install selenium pytesseract pillow
# brew install tesseract

BASE_URL = "https://www.drumondpark.co.uk"
PAGE_URL = f"{BASE_URL}/articulate_cards"

CARD_LOAD_TIMEOUT = 10
CLICK_DELAY = 1.5


def cards_path(category_name):
    return f"/cards2/articulate/{category_name[0].lower()}/"


def get_card_image_url(driver, cards_path):
    imgs = driver.find_elements(By.CSS_SELECTOR, f"img[src*='{cards_path}']")
    if imgs:
        return imgs[0].get_attribute("src")

    raise RuntimeError("Could not find card image URL in DOM")


def wait_for_new_card(driver, cards_path, previous_url):
    WebDriverWait(driver, CARD_LOAD_TIMEOUT).until(
        lambda d: get_card_image_url(d, cards_path) != previous_url
    )


def ocr_word(image_url):
    res = requests.get(image_url)
    res.raise_for_status()
    image = Image.open(io.BytesIO(res.content))
    return pytesseract.image_to_string(image).strip()


def scrape_category(driver, category_name, post):
    path = cards_path(category_name)

    while True:
        image_url = get_card_image_url(driver, path)

        word = ocr_word(image_url)

        if word:
            result = post(word, category_name)
            if result is not None:
                print(f"[{category_name}] {word}")
            else:
                print(f"[{category_name}] Post failed for {word}")
        else:
            print(f"[{category_name}] OCR failed for {image_url}")

        flip_container = driver.find_element(By.CSS_SELECTOR, "div.flip-container")
        flip_container.click()
        time.sleep(CLICK_DELAY)
        wait_for_new_card(driver, path, image_url)


if __name__ == '__main__':
    auth = AuthSession(ENV["ADMIN_EMAIL"], ENV["ADMIN_PASSWORD"])

    CATEGORY_NAME_OVERRIDES = {"people": "person"}

    def post(word, category_name):
        category_name = category_name.lower()
        category_name = CATEGORY_NAME_OVERRIDES.get(category_name, category_name)
        return request(
            url_suffix="/api/words/",
            data={"word": word, "category_name": category_name},
            auth=auth
        )

    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    driver = webdriver.Chrome(options=options)
    driver.get(PAGE_URL)

    if len(sys.argv) != 2:
        sys.exit(f"Usage: {sys.argv[0]} <category>")

    requested_category = sys.argv[1].lower()
    ALIASES = {"person": "people", "people": "person"}
    candidates = {requested_category, ALIASES.get(requested_category, requested_category)}

    category_names = [
        btn.get_attribute("title") or btn.get_attribute("name")
        for btn in driver.find_elements(By.CSS_SELECTOR, "div#c_topics button[title]")
    ]

    matches = [c for c in category_names if c.lower() in candidates]
    if not matches:
        sys.exit(f"Unknown category: {sys.argv[1]}")
    category_name = matches[0]

    button = driver.find_element(
        By.CSS_SELECTOR, f"div#c_topics button[title='{category_name}']"
    )
    button.click()
    time.sleep(CLICK_DELAY)
    scrape_category(driver, category_name, post)

    driver.quit()
