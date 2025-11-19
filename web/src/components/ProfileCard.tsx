import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Paper } from '@mui/material';
import { LinkedIn, GitHub, Email, ContentCopy, Check } from '@mui/icons-material';
import { socialLinks } from '../data/projects';

const ProfileCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'joshua.hamburger@uwaterloo.ca';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        border: '2px solid #000000',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        component="img"
        src="images/1709583939547.png"
        alt="Joshua Hamburger"
        sx={{
          width: 100,
          height: 100,
          mb: 2,
          borderRadius: '50%', // Keep circle for face
          border: '2px solid #000000',
          filter: 'grayscale(100%)', // Retro feel
          transition: 'filter 0.3s',
          '&:hover': {
            filter: 'grayscale(0%)',
          },
        }}
      />
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        Joshua Hamburger
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Software Developer
        <br />
        @ Expertise AI
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Tooltip title="LinkedIn">
          <IconButton
            onClick={() => window.open(socialLinks.linkedin, '_blank')}
            size="small"
            sx={{ border: '1px solid #000000', borderRadius: 0 }}
          >
            <LinkedIn fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="GitHub">
          <IconButton
            onClick={() => window.open('https://github.com/HamburgJ', '_blank')}
            size="small"
            sx={{ border: '1px solid #000000', borderRadius: 0 }}
          >
            <GitHub fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={copied ? "Copied!" : "Copy Email"}>
          <IconButton
            onClick={handleCopyEmail}
            size="small"
            sx={{ border: '1px solid #000000', borderRadius: 0 }}
          >
            {copied ? <Check fontSize="small" /> : <Email fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default ProfileCard;

