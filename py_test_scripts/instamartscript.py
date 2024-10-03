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
    page.goto("https://www.swiggy.com/instamart/search")

    
    # Step 2: Locate the search input box using its attributes
    search_input_selector = 'input[class="cK7Br"]'

    # Step 3: Type the product name (e.g., "Heinz Ketchup") into the search box
    page.fill(search_input_selector, product)

    # Step 4: Press "Enter" to trigger the search
    page.press(search_input_selector, "Enter")

    # Wait for results to load (adjust the time as necessary)
    page.wait_for_timeout(3000)  # Wait for 3 seconds to see results  TODO: make this better
    
    
    # Step 5: Extract product names, quantities, and prices
    product_brands = page.locator("div.sc-aXZVg.bOMOAM._1s3J_").all_text_contents()
    product_names = page.locator("div.sc-aXZVg.hwhxsS._1sPB0").all_text_contents()
    product_quantities = page.locator("div.sc-aXZVg.gIScN._3JJnz").all_text_contents()
    product_prices = page.locator("div.sc-aXZVg.ihMJwf._2Pf8a").all_text_contents()


    # Step 6: Print the product details

    print("Product Details:")
    for brand, name, quantity, price in zip(product_brands, product_names, product_quantities, product_prices):
        print(f"Brand: {brand}, Product: {name}, Quantity: {quantity}, Price: {price}")

    
    # Wait for results to load (adjust the time as necessary)
    page.wait_for_timeout(5000)  # Wait for 3 seconds to see results
    
    # Close the browser
    context.close()

    # Close the browser
    browser.close()


# Run the Playwright script
with sync_playwright() as playwright:
    run(playwright)
