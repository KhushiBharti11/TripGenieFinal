import time
import requests
import logging
import traceback

# Selenium-related imports
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def scrape_hotels_trivago(destination):
    try:
        logger.info(f"Scraping hotels for destination: {destination}")

        # Setup headless Chrome
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")

        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

        # Construct Trivago search URL
        url = f"https://www.trivago.in/en-IN/srl?search={destination}"
        driver.get(url)

        # Wait for page to load
        time.sleep(5)

        hotel_data = []
        hotel_cards = driver.find_elements(By.CSS_SELECTOR, 'li[data-testid="accommodation-list-element"]')

        if not hotel_cards:
            logger.warning("No hotel cards found. Returning sample data.")
            driver.quit()
            return generate_sample_hotels(destination)

        for card in hotel_cards[:5]:
            try:
                name = card.find_element(By.CSS_SELECTOR, '[data-testid="item-name"]').text
                price = card.find_element(By.CSS_SELECTOR, '[data-testid="recommended-price"]').text
                rating_elem = card.find_elements(By.CSS_SELECTOR, '[data-testid="rating-component"]')
                rating = rating_elem[0].text if rating_elem else "N/A"
                hotel_data.append({
                    'name': name,
                    'price': price,
                    'rating': rating,
                    'image_url': '',
                    'description': f"Hotel in {destination}"
                })
            except Exception as e:
                logger.warning(f"Error parsing hotel card: {e}")

        driver.quit()
        return hotel_data

    except Exception as e:
        logger.error(f"Exception during scraping: {e}")
        logger.error(traceback.format_exc())
        return generate_sample_hotels(destination)

def generate_sample_hotels(destination):
    return [
        {
            'name': f'{destination} Grand Hotel',
            'price': '₹5,000 - ₹10,000 per night',
            'rating': '4.5/5',
            'image_url': '',
            'description': 'Luxury hotel with great amenities.'
        },
        {
            'name': f'{destination} Budget Inn',
            'price': '₹1,500 - ₹3,000 per night',
            'rating': '4.0/5',
            'image_url': '',
            'description': 'Affordable and comfortable stay.'
        }
    ]

def get_hotels_data(destination):
    return scrape_hotels_trivago(destination)

if __name__ == "__main__":
    dest = input("Enter a city to search hotels: ")
    results = get_hotels_data(dest)
    for hotel in results:
        print(f"{hotel['name']} | {hotel['price']} | {hotel['rating']}")
        print(f"   {hotel['description']}")
