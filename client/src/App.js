import React, { useState, useRef } from 'react';
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
import LogoCollection from './components/LogoCollection';

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
  backgroundImage: `url(${'/static/screenshots/material-ui/getting-started/templates/dashboard.jpg'})`,
  backgroundSize: 'cover',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
    backgroundImage: `url(${'/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg'})`,
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderColor: theme.palette.grey[700],
  }),
}));

function App() {
  const [product, setProduct] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Create a ref to handle scrolling to the results container
  const resultsRef = useRef(null);

  const handleSearch = async () => {
    if (!product.trim()) {
      alert('Please enter a valid product name.');
      return;
    }

    setLoading(true);
    setButtonDisabled(true);

    try {
      const response = await axios.post('https://7d56-2405-201-1f-2164-b3f0-fbe5-936d-1694.ngrok-free.app/scrape', { product });
      setResults(response.data);
      
      // Scroll to results after loading
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
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
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pt: { xs: 5, sm: 10 },
            pb: { xs: 5, sm: 8 },
          }}
        >
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
          >
            <Typography
              variant="h1"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                fontSize: 'clamp(2.5rem, 8vw, 3rem)',
                mb: 2,
              }}
            >
              Browse&nbsp;online&nbsp;
              <Typography
                component="span"
                variant="h1"
                sx={(theme) => ({
                  fontSize: 'inherit',
                  color: 'primary.main',
                  ...theme.applyStyles('dark', {
                    color: '#3B5D7C',
                  }),
                })}
              >
                delivery stores
              </Typography>
            </Typography>

            {/* Input and Button centered */}
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Enter product name"
                style={{
                  padding: '12px',
                  borderRadius: '5px',
                  border: `1px solid ${theme.palette.grey[300]}`,
                  width: '300px',
                }}
              />
              <Button
                onClick={handleSearch}
                size="small"
                variant="contained"
                disabled={buttonDisabled}
                sx={{
                  bgcolor: theme.palette.info.main,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    bgcolor: theme.palette.primary.light,
                  },
                }}
              >
                {loading ? <CircularProgress size={20} /> : 'Search'}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Results Section */}
      <Container ref={resultsRef}>
        <div className="results">
          {results.map((item, index) => (
            <DarkCardComponent
              key={index}
              brandName={item.brand_name}
              price={formatPrice(item.price)}
              quantity={item.quantity}
              source={item.source}
              product={product}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default App;
