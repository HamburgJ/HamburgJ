import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const [isTypingDone, setIsTypingDone] = useState(false);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      sx={{
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h6"
        component="h1"
        sx={{ 
          mb: 1,
          fontWeight: 700,
          background: 'linear-gradient(45deg, #1e88e5, #1565c0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        <TypeAnimation
          sequence={[
            'Hi, I\'m Joshua Hamburger',
            () => setIsTypingDone(true),
          ]}
          wrapper="span"
          cursor={!isTypingDone}
          speed={50}
          style={{ display: 'inline-block' }}
        />
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ 
          color: 'text.secondary',
          fontWeight: 500,
          opacity: 0.9,
        }}
      >
        4th Year Computer Engineering Student at the University of Waterloo, making software for humans.
      </Typography>
    </Box>
  );
};

export default Hero; 