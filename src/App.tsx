import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  useMediaQuery
} from '@mui/material';
import AIAdoptionCalculator from './components/AIAdoptionCalculator';

// Google系配色
const theme = createTheme({
  palette: {
    primary: {
      main: '#4285F4', // Google 蓝色
    },
    secondary: {
      main: '#34A853', // Google 绿色
    },
    error: {
      main: '#EA4335', // Google 红色
    },
    warning: {
      main: '#FBBC05', // Google 黄色
    },
    background: {
      default: '#f5f5f5',
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            evalAI
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            评估任务中AI介入的适宜程度
          </Typography>
        </Box>
        
        <AIAdoptionCalculator isMobile={isMobile} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
