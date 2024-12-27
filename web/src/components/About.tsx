import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <Box sx={{ mb: 6 }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        elevation={1}
        sx={{ 
          p: 4,
          background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            component="img"
            src="images/University_of_Waterloo_seal.svg.png"
            alt="University of Waterloo"
            sx={{
              width: 80,
              height: 80,
              objectFit: 'contain',
              filter: 'grayscale(0.2)',
            }}
          />
          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Education
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                mb: 0.5,
              }}
            >
              University of Waterloo
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'text.secondary',
                opacity: 0.9,
              }}
            >
              4th Year Computer Engineering
            </Typography>
          </Box>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            mt: 3,
            color: 'text.secondary',
            lineHeight: 1.6,
          }}
        >
          Passionate about building innovative software solutions and turning complex problems into elegant applications.
        </Typography>
      </Paper>
    </Box>
  );
};

export default About; 