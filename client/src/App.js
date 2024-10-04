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
      <Box
        id="hero"
        sx={(theme) => ({
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 50% -50px, hsl(210, 100%, 90%), transparent)',
          ...theme.applyStyles('dark', {
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 50% -50px, hsl(210, 100%, 16%), transparent)',
          }),
        })}
      >
        <Container>
          <Stack spacing={2} sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}>
            <Typography variant="h1" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
              Browse&nbsp;online&nbsp;
              <Typography component="span" variant="h1" sx={{ fontSize: 'inherit', color: 'primary.main' }}>
                delivery stores
              </Typography>
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Enter product name"
                style={{ padding: '12px', borderRadius: '5px', border: `1px solid ${theme.palette.grey[300]}`, width: '300px' }}
              />
              <Button
                onClick={handleSearch}
                size="small"
                variant="contained"
                disabled={buttonDisabled}
                sx={{ bgcolor: theme.palette.info.main, color: theme.palette.text.secondary, '&:hover': { bgcolor: theme.palette.primary.light } }}
              >
                {loading ? <CircularProgress size={20} /> : 'Search'}
              </Button>
            </Stack>
          </Stack>
        </Container>
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
              product={product}  // Pass the product to the component
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default App;
