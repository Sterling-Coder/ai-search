import requests
from bs4 import BeautifulSoup

url = "https://www.thena.ai"
headers = {"User-Agent": "Mozilla/5.0"}
response = requests.get(url, headers=headers)
response.encoding = 'utf-8'  # Force correct decoding

soup = BeautifulSoup(response.text, "html.parser")

# Extract all visible text
for tag in soup.find_all(["p", "h1", "h2", "li"]):
    print(tag.get_text(strip=True))