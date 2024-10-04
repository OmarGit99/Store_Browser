---

# Store Browser

## Description

Store Browser is a web application that allows users to search for products across multiple online delivery stores such as Swiggy, Zepto, and Blinkit. The application scrapes data from these sources, merges and sorts the results, and displays them in a user-friendly interface. The backend is built with Node.js and Express, while the frontend is developed using React and Material UI. The application is deployed using Render for the backend and Vercel for the frontend.

## Use Case

This application is useful for users who want to compare product prices and availability across different online delivery platforms. It provides a consolidated view of products, making it easier to find the best deals and make informed purchasing decisions.

## TODO

- [ ] Improve UI
- [ ] Add Links to products
- [x] Add loading indicators
- [ ] Add user location
- [x] Force one-time button click
- [ ] Format product cards
- [x] Validate blank input text
- [ ] Add LogoCollection
- [ ] Implement AI features

## Technologies Used

- **Playwright**: For web scraping
- **Node.js & Express**: Backend server
- **React**: Frontend framework
- **Material UI**: UI components
- **Render**: Backend deployment
- **Vercel**: Frontend deployment

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB (Atlas or local instance)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/product-scraper.git
   cd product-scraper
   ```

2. **Install dependencies for the backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Install dependencies for the frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**:
   ```bash
   cd backend
   node server.js
   ```

2. **Start the frontend**:
   ```bash
   cd ../frontend
   npm start
   ```

### Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

## License

This project is licensed under the MIT License.

---

