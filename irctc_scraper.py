from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

def scrape_irctc_trains(from_station, to_station, journey_date):
    # Configure Chrome options
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")

    # Initialize WebDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    # Navigate to IRCTC website
    driver.get("https://www.irctc.co.in/nget/train-search")

    wait = WebDriverWait(driver, 20)

    # Handle possible alert popup
    try:
        alert_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".btn-primary")))
        alert_button.click()
    except:
        pass  # No alert present

    # Input From Station
    from_input = wait.until(EC.element_to_be_clickable((By.ID, "origin")))
    from_input.click()
    from_input.send_keys(from_station)
    time.sleep(1)
    from_input.send_keys("\n")

    # Input To Station
    to_input = driver.find_element(By.ID, "destination")
    to_input.click()
    to_input.send_keys(to_station)
    time.sleep(1)
    to_input.send_keys("\n")

    # Set Date of Journey using JavaScript
    driver.execute_script(f"document.getElementById('jDate').value = '{journey_date}'")

    # Click on Search button
    search_btn = driver.find_element(By.CSS_SELECTOR, "button.search_btn.train_Search")
    search_btn.click()

    # Wait for results to load
    time.sleep(6)

    # Fetch train details
    trains = driver.find_elements(By.CLASS_NAME, "train-heading")
    print("\nTop 5 Trains from", from_station, "to", to_station, "on", journey_date)
    print("="*60)
    if trains:
        for i, train in enumerate(trains[:5]):
            print(f"{i+1}. {train.text}")
    else:
        print("No trains found or failed to load results.")

    driver.quit()

# Run example
if __name__ == "__main__":
    scrape_irctc_trains("NDLS", "CNB", "22-04-2025")
