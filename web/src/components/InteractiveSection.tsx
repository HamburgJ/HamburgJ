import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const InteractiveSection: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        component="h2"
        sx={{ mb: 4, textAlign: 'center' }}
      >
        Interactive Space
      </Typography>
      <Paper
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        elevation={3}
        sx={{
          p: 4,
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h5" color="text.secondary">
          Something awesome is coming here...
        </Typography>
      </Paper>
    </Container>
  );
};

export default InteractiveSection; 