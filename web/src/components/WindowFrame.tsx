import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { Close, CropSquare, Minimize } from '@mui/icons-material';

interface WindowFrameProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ title, children, onClose }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        border: '2px solid #000000',
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Title Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#000080',
          color: '#FFFFFF',
          px: 1,
          py: 0.5,
          borderBottom: '2px solid #000000',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: 1,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: '#C0C0C0',
              border: '1px solid #FFFFFF',
              borderRightColor: '#404040',
              borderBottomColor: '#404040',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Minimize sx={{ fontSize: 14, color: '#000000', mb: 1 }} />
          </Box>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: '#C0C0C0',
              border: '1px solid #FFFFFF',
              borderRightColor: '#404040',
              borderBottomColor: '#404040',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <CropSquare sx={{ fontSize: 12, color: '#000000' }} />
          </Box>
          <Box
            onClick={onClose}
            sx={{
              width: 20,
              height: 20,
              backgroundColor: '#C0C0C0',
              border: '1px solid #FFFFFF',
              borderRightColor: '#404040',
              borderBottomColor: '#404040',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:active': {
                border: '1px solid #404040',
                borderRightColor: '#FFFFFF',
                borderBottomColor: '#FFFFFF',
              }
            }}
          >
            <Close sx={{ fontSize: 14, color: '#000000' }} />
          </Box>
        </Box>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3,
          backgroundColor: '#FFFFFF',
          position: 'relative',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default WindowFrame;

