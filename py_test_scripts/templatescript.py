from playwright.sync_api import sync_playwright

def run(playwright):
    # Step 1: Launch a new browser session
    browser = playwright.chromium.launch(headless=False)  # headless=False allows you to see the browser
    page = browser.new_page()

    # Step 2: Go to the Amazon homepage (replace with your desired website)
    page.goto("https://www.zeptonow.com/")

    # Step 3: Interact with the search bar and enter the product name
    search_selector = "input[name='field-keywords']"  # The name attribute for Amazon's search bar
    page.fill(search_selector, "laptop")

    # Step 4: Press Enter to search (you can also click the search button if preferred)
    page.press(search_selector, "Enter")

    # Step 5: Wait for the search results to load
    page.wait_for_selector("div.s-main-slot.s-result-list")  # Main div containing search results

    # Step 6: Extract product details (titles and prices)
    # Use CSS selectors to target specific elements within the search results
    products = page.query_selector_all("div.s-main-slot div[data-component-type='s-search-result']")

    # Step 7: Print out product details
    for product in products:
        title = product.query_selector("h2 span").inner_text()
        price_whole = product.query_selector("span.a-price-whole")
        price_fraction = product.query_selector("span.a-price-fraction")

        # Some products might not have prices, so check first
        if price_whole and price_fraction:
            price = f"${price_whole.inner_text()}.{price_fraction.inner_text()}"
        else:
            price = "Price not available"

        print(f"Product: {title}, Price: {price}")

    # Step 8: Close the browser
    browser.close()

# Run the Playwright script
with sync_playwright() as playwright:
    run(playwright)
