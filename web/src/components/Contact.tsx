import React, { useState } from 'react';
import { Box, Typography, IconButton, Modal, Button, Snackbar, TextField, InputAdornment } from '@mui/material';
import { LinkedIn, GitHub, Email, ContentCopy, Launch, Check } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { socialLinks } from '../data/projects';

interface ContactLink {
  icon: React.ReactNode;
  url?: string;
  label: string;
  onClick: () => void;
  bgColor: string;
}

const Contact: React.FC = () => {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = 'joshua.hamburger@uwaterloo.ca';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailto = () => {
    window.location.href = `mailto:${email}`;
    setEmailModalOpen(false);
  };

  const links: ContactLink[] = [
    {
      icon: <LinkedIn sx={{ fontSize: 32 }} />,
      url: socialLinks.linkedin,
      label: 'LinkedIn',
      onClick: () => window.open(socialLinks.linkedin, '_blank'),
      bgColor: 'rgba(0, 119, 181, 0.1)'
    },
    {
      icon: <GitHub sx={{ fontSize: 32 }} />,
      url: 'https://github.com/HamburgJ',
      label: 'GitHub',
      onClick: () => window.open('https://github.com/HamburgJ', '_blank'),
      bgColor: 'rgba(51, 51, 51, 0.1)'
    },
    {
      icon: <Email sx={{ fontSize: 32 }} />,
      label: 'Email',
      onClick: () => setEmailModalOpen(true),
      bgColor: 'rgba(212, 70, 56, 0.1)'
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {links.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  width: '100%',
                  '&:hover': {
                    '& .MuiTypography-root': {
                      color: 'primary.main',
                    },
                    '& .MuiIconButton-root': {
                      background: link.bgColor,
                    }
                  }
                }}
                onClick={link.onClick}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  animate={{ rotate: 0 }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                >
                  <IconButton
                    color="primary"
                    size="large"
                    aria-label={link.label}
                    sx={{
                      background: 'rgba(25, 118, 210, 0.04)',
                      pointerEvents: 'none'
                    }}
                  >
                    {link.icon}
                  </IconButton>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1, x: 4 }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 500,
                      transition: 'color 0.2s ease-in-out'
                    }}
                  >
                    {link.label}
                  </Typography>
                </motion.div>
              </Box>
            </motion.div>
          ))}
        </Box>
      </motion.div>

      <Modal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        aria-labelledby="email-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Box sx={{
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}>
            <Typography id="email-modal-title" variant="h6" component="h2" gutterBottom>
              Contact Email
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                value={email}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleCopyEmail}
                        edge="end"
                        color={copied ? "success" : "primary"}
                      >
                        {copied ? <Check /> : <ContentCopy />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    cursor: 'default',
                    userSelect: 'all',
                  }
                }}
              />
              <Typography 
                variant="caption" 
                color={copied ? "success.main" : "text.secondary"}
                sx={{ 
                  textAlign: 'center',
                  opacity: copied ? 1 : 0,
                  transition: 'opacity 0.2s ease-in-out'
                }}
              >
                Copied to clipboard!
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Launch />}
                onClick={handleMailto}
                fullWidth
              >
                Open in Email Client
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Modal>
    </Box>
  );
};

export default Contact;