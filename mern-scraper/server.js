const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { chromium } = require('playwright'); 

const app = express();
app.use(bodyParser.json());

// CORS configuration for handling preflight and cross-origin requests
const corsOptions = {
  origin: 'https://store-browser.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

const mongoURI = process.env.MONGODB_URI || 'YOUR_MONGODB_CONNECTION_STRING_HERE';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error('MongoDB connection error:', error));

const ProductSchema = new mongoose.Schema({
    brand_name: String,
    quantity: String,
    price: String,
    source: String  
});

const Product = mongoose.model('Product', ProductSchema);

// Scraping function for Swiggy
const scrapeSwiggy = async (product, browser) => {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    permissions: ['geolocation'],
    geolocation: { latitude: 19.0188907, longitude: 73.0287094 },
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    isMobile: false,
    locale: 'en-US',
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

  await page.close();

  const brand_names = product_brands.map((brand, index) => `${brand} ${product_names[index]}`);
  return brand_names.map((brand_name, index) => ({
    brand_name,
    quantity: product_quantities[index],
    price: product_prices[index],
    source: 'Swiggy'
  }));
};

// Scraping function for ZeptoNow
const scrapeZeptoNow = async (product, browser) => {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    permissions: ['geolocation'],
    geolocation: { latitude: 19.0188907, longitude: 73.0287094 },
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    isMobile: false,
    locale: 'en-US',
  });
  const page = await context.newPage();
  await page.goto('https://www.zeptonow.com/search');

  const button_selector = "button[data-testid='auto-address-btn']";
  try {
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

  await page.close();

  return product_names.map((name, index) => ({
    brand_name: name, 
    quantity: product_quantities[index],
    price: product_prices[index],
    source: 'ZeptoNow'
  }));
};

// Scraping function for BlinkIt
const scrapeBlinkIt = async (product, browser) => {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    permissions: ['geolocation'],
    geolocation: { latitude: 19.0188907, longitude: 73.0287094 },
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    isMobile: false,
    locale: 'en-US',
  });

  const page = await context.newPage();
  await page.goto('https://blinkit.com/s/');

  const button_selector = 'button[class="btn location-box mask-button"]';
  try {
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

  await page.close();

  return product_names.map((name, index) => ({
    brand_name: name,
    quantity: product_quantities[index],
    price: product_prices[index],
    source: 'BlinkIt'
  }));
};

// Interleave results from different sources
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

// Main scrape endpoint
app.post('/scrape', async (req, res) => {
  const { product } = req.body;

  // Launch the Playwright browser only once
  const browser = await chromium.launch({ headless: true });

  try {
    const swiggyData = await scrapeSwiggy(product, browser);
    const zeptonowData = await scrapeZeptoNow(product, browser);
    const blinkitData = await scrapeBlinkIt(product, browser);

    const products = interleaveResults([swiggyData, zeptonowData, blinkitData]);

    await Product.insertMany(products);
    res.json(products);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).send('Error occurred while scraping data');
  } finally {
    await browser.close();
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
