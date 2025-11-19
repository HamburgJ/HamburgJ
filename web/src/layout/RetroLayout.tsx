import React from 'react';
import { Box, useMediaQuery, Theme } from '@mui/material';
import Sidebar from '../components/Sidebar';

interface RetroLayoutProps {
  children: React.ReactNode;
}

const RetroLayout: React.FC<RetroLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#F0F0E0',
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default RetroLayout;

