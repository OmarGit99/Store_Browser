import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DarkCardComponent from './components/DarkCardComponent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getDesignTokens } from './theme/themePrimitives';
import { styled } from '@mui/material/styles';

const theme = createTheme(getDesignTokens('dark'));

const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundSize: 'cover',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderColor: theme.palette.grey[700],
  }),
}));

function App() {
  const [product, setProduct] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleSearch = async () => {
    if (!product.trim()) {
      alert('Please enter a valid product name.');
      return;
    }

    setLoading(true);
    setButtonDisabled(true);

    try {
      const response = await axios.post('https://store-browser.onrender.com/scrape', { product });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }

    setTimeout(() => {
      setLoading(false);
      setButtonDisabled(false);
    }, 10000);
  };

  const formatPrice = (price) => {
    const priceStr = String(price).trim();
    if (!priceStr.startsWith('₹') && !priceStr.startsWith('Rs')) {
      return `₹${priceStr}`;
    }
    return priceStr;
  };

  return (
    <div className="App">
      <Box id="hero">
        {/* Input and Button */}
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter product name"
        />
        <Button onClick={handleSearch} disabled={buttonDisabled}>
          {loading ? <CircularProgress size={20} /> : 'Search'}
        </Button>
      </Box>

      <Container>
        <div className="results">
          {results.map((item, index) => (
            <DarkCardComponent
              key={index}
              brandName={item.brand_name}
              price={formatPrice(item.price)}
              quantity={item.quantity}
              source={item.source}
              product={product} // Pass product prop here
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default App;
