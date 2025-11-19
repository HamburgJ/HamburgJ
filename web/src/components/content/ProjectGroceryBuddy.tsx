import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHub, Launch, ReceiptLong } from '@mui/icons-material';

const ProjectGroceryBuddy: React.FC = () => {
  const [receiptId, setReceiptId] = useState(0);

  const handleTear = () => {
    setReceiptId((prev) => prev + 1);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#8d6e63', // Wood table color
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%235d4037\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={receiptId}
          initial={{ y: -500, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 500, opacity: 0, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{ position: 'relative' }}
        >
          <Box
            sx={{
              width: 320,
              backgroundColor: '#fff',
              p: 3,
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              fontFamily: '"Courier New", monospace',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: 0,
                width: '100%',
                height: 10,
                background: 'linear-gradient(45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%)',
                backgroundSize: '20px 40px',
                backgroundPosition: '0 -20px',
              },
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3, borderBottom: '1px dashed #000', pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
                GROCERY BUDDY
              </Typography>
              <Typography variant="caption">
                STORE #1337 • {new Date().toLocaleDateString()}
              </Typography>
              <Typography variant="caption" display="block">
                SERVING ONTARIO, CA
              </Typography>
            </Box>

            {/* Items */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">1x PRICE TRACKING</Typography>
                <Typography variant="body2">$0.00</Typography>
              </Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, pl: 2, color: '#555' }}>
                * Live updates across stores
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">1x REACT FRONTEND</Typography>
                <Typography variant="body2">$0.00</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">1x NODE.JS API</Typography>
                <Typography variant="body2">$0.00</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">1x WEB SCRAPER</Typography>
                <Typography variant="body2">$0.00</Typography>
              </Box>
            </Box>

            {/* Total */}
            <Box sx={{ borderTop: '1px dashed #000', pt: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography variant="body1">TOTAL</Typography>
                <Typography variant="body1">PRICELESS</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">SAVINGS</Typography>
                <Typography variant="body2">$$$</Typography>
              </Box>
            </Box>

            {/* Barcode / Links */}
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  height: 50,
                  background: 'repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 4px)',
                  mb: 1,
                  cursor: 'pointer',
                  opacity: 0.8,
                  '&:hover': { opacity: 1 },
                }}
                onClick={() => window.open('https://github.com/HamburgJ/grocery-buddy', '_blank')}
              />
              <Typography variant="caption" sx={{ letterSpacing: 4 }}>
                1234 5678 9012
              </Typography>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<GitHub />}
                  onClick={() => window.open('https://github.com/HamburgJ/grocery-buddy', '_blank')}
                  sx={{ color: '#000', textTransform: 'none' }}
                >
                  Repo
                </Button>
                <Button
                  size="small"
                  startIcon={<Launch />}
                  onClick={() => window.open('https://hamburgj.github.io/grocery-buddy', '_blank')}
                  sx={{ color: '#000', textTransform: 'none' }}
                >
                  Demo
                </Button>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Tear Button */}
      <Button
        variant="contained"
        startIcon={<ReceiptLong />}
        onClick={handleTear}
        sx={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          backgroundColor: '#5d4037',
          '&:hover': { backgroundColor: '#4e342e' },
        }}
      >
        Print New Receipt
      </Button>
    </Box>
  );
};

export default ProjectGroceryBuddy;
