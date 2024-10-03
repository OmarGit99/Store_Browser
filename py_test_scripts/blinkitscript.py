from playwright.sync_api import sync_playwright

def run(playwright):
    #TODO introduce pagination

    product = "blue cheese"

    # Step 1: Launch a new browser session
    browser = playwright.chromium.launch(headless=False)  # headless=False allows you to see the browser

    context = browser.new_context(
        permissions=["geolocation"],  # Grant location access
        geolocation={"latitude": 19.0188907, "longitude": 73.0287094},  # Set a mock location TODO allowusers to enter custom location
        viewport={"width": 1280, "height": 720}
    )

   
    page = context.new_page()

    # Step 2: Go to the Amazon homepage (replace with your desired website)
    page.goto("https://blinkit.com/s/")

    button_selector = 'button[class="btn location-box mask-button"]'

    # Wait until the button is available, and then click it
    page.wait_for_selector(button_selector)
    page.click('button[class="btn location-box mask-button"]', force=True) 

    # Step 2: Locate the search input box using its attributes
    search_input_selector = 'input[class="SearchBarContainer__Input-sc-hl8pft-3 irVxjq"]'

    # Step 3: Type the product name (e.g., "Heinz Ketchup") into the search box
    page.fill(search_input_selector, product)

    # Step 4: Press "Enter" to trigger the search
    page.press(search_input_selector, "Enter")

    # Wait for results to load (adjust the time as necessary)
    page.wait_for_timeout(3000)  # Wait for 3 seconds to see results  TODO: make this better

    # Step 5: Extract product names, quantities, and prices
    product_names = page.locator("div.Product__UpdatedTitle-sc-11dk8zk-9.hxWnoO").all_text_contents()
    product_quantities = page.locator("span[class='bff_variant_text_only plp-product__quantity--box']").all_text_contents()
    product_prices = page.locator("div.Product__UpdatedPriceAndAtcContainer-sc-11dk8zk-10.ljxcbQ div[style*='color: rgb(31, 31, 31)']").all_text_contents()


    # Step 6: Print the product details

    print("Product Details:")
    for name, quantity, price in zip(product_names, product_quantities, product_prices):
        print(f"Product: {name}, Quantity: {quantity}, Price: {price}")

    
    # Wait for results to load (adjust the time as necessary)
    page.wait_for_timeout(5000)  # Wait for 3 seconds to see results

    # Close the browser
    context.close()

    # Close the browser
    browser.close()


# Run the Playwright script
with sync_playwright() as playwright:
    run(playwright)
