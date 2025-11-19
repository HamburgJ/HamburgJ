import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ProfileCard from './ProfileCard';
import FileExplorer from './FileSystem/FileExplorer';

const Sidebar: React.FC = () => {
  return (
    <Box
      sx={{
        width: { xs: '100%', md: 300 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        borderRight: { md: '2px solid #000000' },
        overflowY: 'auto',
        backgroundColor: '#F0F0E0',
      }}
    >
      <ProfileCard />
      
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 2,
          border: '2px solid #000000',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #000000', pb: 1 }}>
          EXPLORER
        </Typography>
        <FileExplorer />
      </Paper>
    </Box>
  );
};

export default Sidebar;

