const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { chromium } = require('playwright'); 

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect('mongoURI', { useNewUrlParser: true, useUnifiedTopology: true });

const ProductSchema = new mongoose.Schema({
    brand_name: String,
    quantity: String,
    price: String,
    source: String  
});

const Product = mongoose.model('Product', ProductSchema);


const scrapeSwiggy = async (product) => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        permissions: ['geolocation'],
        geolocation: { latitude: 19.0188907, longitude: 73.0287094 },
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();
    await page.goto('https://www.swiggy.com/instamart/search');
    await page.fill('input[class="cK7Br"]', product);
    await page.press('input[class="cK7Br"]', 'Enter');
    await page.waitForTimeout(3000);

    const product_brands = await page.locator('div.sc-aXZVg.bOMOAM._1s3J_').allTextContents();
    const product_names = await page.locator('div.sc-aXZVg.hwhxsS._1sPB0').allTextContents();
    const product_quantities = await page.locator('div.sc-aXZVg.gIScN._3JJnz').allTextContents();
    const product_prices = await page.locator('div.sc-aXZVg.ihMJwf._2Pf8a').allTextContents();

    await browser.close();

    const brand_names = product_brands.map((brand, index) => `${brand} ${product_names[index]}`);

    return brand_names.map((brand_name, index) => ({
        brand_name,
        quantity: product_quantities[index],
        price: product_prices[index],
        source: 'Swiggy'
    }));
};


const scrapeZeptoNow = async (product) => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        permissions: ['geolocation'],
        geolocation: { latitude: 19.0188907, longitude: 73.0287094 },
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();
    await page.goto('https://www.zeptonow.com/search');

    const button_selector = "button[data-testid='auto-address-btn']";
    try {
        // Attempt to wait for the selector and click if found, with a timeout of 3000 ms
        await page.waitForSelector(button_selector, { timeout: 1000 });
        await page.click(button_selector, { force: true });
    } catch (error) {
        console.log('Button not found or already clicked, proceeding without clicking.');
    }

    const search_input_selector = "input[placeholder='Search for over 5000 products']";
    await page.fill(search_input_selector, product);
    await page.press(search_input_selector, 'Enter');
    await page.waitForTimeout(3000);

    const product_names = await page.locator("h5[data-testid='product-card-name']").allTextContents();
    const product_quantities = await page.locator("span[data-testid='product-card-quantity'] h4").allTextContents();
    const product_prices = await page.locator("h4[data-testid='product-card-price']").allTextContents();

    await browser.close();

    return product_names.map((name, index) => ({
        brand_name: name, 
        quantity: product_quantities[index],
        price: product_prices[index],
        source: 'ZeptoNow'
    }));
};

const scrapeBlinkIt = async (product) => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        permissions: ['geolocation'],
        geolocation: { latitude: 19.0188907, longitude: 73.0287094 },
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();
    await page.goto('https://blinkit.com/s/');

    const button_selector = 'button[class="btn location-box mask-button"]';
    try {
        // Attempt to wait for the selector and click if found, with a timeout of 3000 ms
        await page.waitForSelector(button_selector, { timeout: 2000 });
        await page.click(button_selector, { force: true });
    } catch (error) {
        console.log('Button not found or already clicked, proceeding without clicking.');
    }

    const search_input_selector = 'input[class="SearchBarContainer__Input-sc-hl8pft-3 irVxjq"]';
    await page.fill(search_input_selector, product);
    await page.press(search_input_selector, 'Enter');
    await page.waitForTimeout(3000);

    const product_names = await page.locator("div.Product__UpdatedTitle-sc-11dk8zk-9.hxWnoO").allTextContents();
    const product_quantities = await page.locator("span[class='bff_variant_text_only plp-product__quantity--box']").allTextContents();
    const product_prices = await page.locator("div.Product__UpdatedPriceAndAtcContainer-sc-11dk8zk-10.ljxcbQ div[style*='color: rgb(31, 31, 31)']").allTextContents();

    await browser.close();

    return product_names.map((name, index) => ({
        brand_name: name,
        quantity: product_quantities[index],
        price: product_prices[index],
        source: 'BlinkIt'
    }));
};

const interleaveResults = (arrays) => {
    const maxLength = Math.max(...arrays.map(arr => arr.length));
    const result = [];

    for (let i = 0; i < maxLength; i++) {
        for (const array of arrays) {
            if (array[i]) {
                result.push(array[i]);
            }
        }
    }

    return result;
};


app.post('/scrape', async (req, res) => {
    const { product } = req.body;

    const run = async () => {
        const swiggyData = await scrapeSwiggy(product);
        const zeptonowData = await scrapeZeptoNow(product);
        const blinkitData = await scrapeBlinkIt(product);

        const products = interleaveResults([swiggyData, zeptonowData, blinkitData]);

        await Product.insertMany(products);
        res.json(products);
    };

    const playwright = await chromium.launch(); 
    await run(playwright);
    await playwright.close(); 
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
