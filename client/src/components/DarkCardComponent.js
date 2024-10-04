import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getDesignTokens } from '../theme/themePrimitives';

const theme = createTheme(getDesignTokens('dark'));

// Update getLink to accept `product` as a parameter
const getLink = (source, product) => {
  const formattedProduct = encodeURIComponent(product.trim());
  switch (source.toLowerCase()) {
    case 'swiggy':
      return `https://www.swiggy.com/instamart/search?custom_back=true&query=${formattedProduct}`;
    case 'blinkit':
      return `https://blinkit.com/s/?q=${formattedProduct}`;
    case 'zeptonow':
      return `https://www.zeptonow.com/search?query=${formattedProduct}`;
    default:
      return '#';
  }
};

const DarkCardComponent = ({ brandName, price, quantity, source, product }) => {
  const link = getLink(source, product);
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'top',
          m: 1,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Card
          sx={{
            width: 300,
            height: 320,
            p: 2,
            bgcolor: 'rgb(18,18,18)',
            boxShadow: theme.shadows[1],
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h4" color="text.primary" gutterBottom>
              {brandName}
            </Typography>
            <Typography variant="h1" color="text.primary">
              {price}
            </Typography>
            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <CheckCircleRoundedIcon sx={{ width: 20, color: theme.palette.info.main }} />
              <Typography variant="subtitle2" color="text.primary">
                {quantity}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mt: 1 }}>
              <CheckCircleRoundedIcon sx={{ width: 20, color: theme.palette.info.main }} />
              <Typography variant="subtitle2" color="text.primary">
                {source}
              </Typography>
            </Box>
          </CardContent>
          <CardActions sx={{ pt: 2, justifyContent: 'center' }}>
            <Button
              fullWidth
              variant="contained"
              href={link}
              target="_blank"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Buy Now
            </Button>
          </CardActions>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default DarkCardComponent;
