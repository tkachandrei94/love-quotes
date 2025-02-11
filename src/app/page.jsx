'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { pink, blue, purple } from '@mui/material/colors';
import { quotes, backgrounds } from '@/data/quotes';

const theme = createTheme({
  palette: {
    male: {
      main: blue[500],
      contrastText: '#fff',
    },
    female: {
      main: pink[500],
      contrastText: '#fff',
    },
    next: {
      main: purple[500],
      contrastText: '#fff',
    },
  },
});

export default function Home() {
  const [selectedGender, setSelectedGender] = useState(null);
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentBg, setCurrentBg] = useState(backgrounds[0]);

  const getRandomQuote = () => {
    const filteredQuotes = quotes.filter(
      quote => quote.gender === selectedGender || quote.gender === 'both'
    );
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    setCurrentQuote(randomQuote.text);
    
    const newBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setCurrentBg(newBg);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    getRandomQuote();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${currentBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out',
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {!selectedGender ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                  Выберите пол
                </Typography>
                <Button
                  variant="contained"
                  color="male"
                  size="large"
                  onClick={() => handleGenderSelect('male')}
                  sx={{ py: 2 }}
                >
                  Мужской
                </Button>
                <Button
                  variant="contained"
                  color="female"
                  size="large"
                  onClick={() => handleGenderSelect('female')}
                  sx={{ py: 2 }}
                >
                  Женский
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography 
                  variant="h5" 
                  component="p" 
                  align="center"
                  sx={{ 
                    fontStyle: 'italic',
                    lineHeight: 1.6 
                  }}
                >
                  {currentQuote}
                </Typography>
                <Button
                  variant="contained"
                  color="next"
                  size="large"
                  onClick={getRandomQuote}
                  sx={{ py: 2 }}
                >
                  Следующая цитата
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
} 