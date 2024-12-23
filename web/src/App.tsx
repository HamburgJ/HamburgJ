import React from 'react';
import { Container, Grid, Paper, Box, CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import theme from './theme';
import MainContent from './components/MainContent';
import Contact from './components/Contact';
import Hero from './components/Hero';

// Single variable to control the rainbow intensity
const RAINBOW_OPACITY = 0.08;

const rainbowMove = keyframes`
  0% {
    background-size: 100% 100%;
    opacity: ${RAINBOW_OPACITY};
  }
  50% {
    background-size: 150% 150%;
    opacity: ${RAINBOW_OPACITY * 1.5};
  }
  100% {
    background-size: 100% 100%;
    opacity: ${RAINBOW_OPACITY};
  }
`;

const App: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:899px)');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          width: '100%',
          background: '#ffffff',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at center, 
              rgba(255,255,255,0.5) 0%, 
              rgba(255,20,147,${RAINBOW_OPACITY * 3}) 10%, 
              rgba(255,0,0,${RAINBOW_OPACITY * 3}) 20%, 
              rgba(255,165,0,${RAINBOW_OPACITY * 3}) 30%, 
              rgba(255,255,0,${RAINBOW_OPACITY * 3}) 40%, 
              rgba(0,255,0,${RAINBOW_OPACITY * 3}) 50%, 
              rgba(0,191,255,${RAINBOW_OPACITY * 3}) 60%, 
              rgba(138,43,226,${RAINBOW_OPACITY * 3}) 70%, 
              rgba(255,255,255,0.5) 100%
            )`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            animation: `${rainbowMove} 8s ease-in-out infinite`,
            pointerEvents: 'none',
            zIndex: 0,
            transformOrigin: 'center center',
            filter: 'blur(30px)',
          }
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            py: 4, 
            position: 'relative', 
            zIndex: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {isMobile ? (
            // Mobile Layout
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Paper sx={{ p: 3, width: '100%' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Box
                      component="img"
                      src="images/1709583939547.jpg"
                      alt="Joshua Hamburger"
                      sx={{
                        width: 80,
                        height: 80,
                        mb: 2,
                        borderRadius: '50%',
                        border: '3px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                    <Hero />
                  </Box>
                  <Contact />
                </Paper>
              </Box>
              <Box>
                <MainContent />
              </Box>
            </Box>
          ) : (
            // Desktop Layout
            <Grid container spacing={3} sx={{ flex: 1, position: 'relative', width: '100%', margin: 0 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ position: 'sticky', top: 24, width: '100%', height: 'fit-content' }}>
                  <Paper sx={{ p: 3, width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                      <Box
                        component="img"
                        src="images/1709583939547.jpg"
                        alt="Joshua Hamburger"
                        sx={{
                          width: 80,
                          height: 80,
                          mb: 2,
                          borderRadius: '50%',
                          border: '3px solid',
                          borderColor: 'primary.main',
                        }}
                      />
                      <Hero />
                    </Box>
                    <Contact />
                  </Paper>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <MainContent />
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App; 