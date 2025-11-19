import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownward, GitHub, Launch, Refresh } from '@mui/icons-material';

const levels = [
  {
    id: 1,
    title: 'Infinite Levels!',
    subtitle: 'A Mind-Bending Puzzle Game',
    text: 'Navigate through an infinite set of recursive levels. The only way out is deeper in.',
    color: '#5C6BC0',
    bg: '#E8EAF6',
  },
  {
    id: 2,
    title: 'The Concept',
    subtitle: 'Recursive Logic',
    text: 'Each level contains the solution to the next. You must think outside the box... by looking inside it.',
    color: '#AB47BC',
    bg: '#F3E5F5',
  },
  {
    id: 3,
    title: 'Tech Stack',
    subtitle: 'Built for the Web',
    text: 'Developed with modern web technologies to ensure smooth performance even at infinite depths.',
    color: '#26A69A',
    bg: '#E0F2F1',
  },
  {
    id: 4,
    title: 'Play Now',
    subtitle: 'Are you ready?',
    text: 'Challenge your mind. See how deep you can go.',
    color: '#EF5350',
    bg: '#FFEBEE',
    action: true,
  },
];

const ProjectInfiniteLevels: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);

  const nextLevel = () => {
    setLevelIndex((prev) => (prev + 1) % levels.length);
  };

  const currentLevel = levels[levelIndex];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background Tunnel Effect */}
      <Box
        sx={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'repeating-radial-gradient(circle, #333, #333 10px, #222 10px, #222 20px)',
          opacity: 0.2,
          animation: 'spin 20s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      />

      <AnimatePresence mode="popLayout">
        <motion.div
          key={levelIndex}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 5, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{
            width: '80%',
            maxWidth: '600px',
            aspectRatio: '1/1',
            position: 'absolute',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: currentLevel.bg,
              border: `20px solid ${currentLevel.color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              textAlign: 'center',
              boxShadow: '0 0 50px rgba(0,0,0,0.5)',
              position: 'relative',
            }}
          >
            {/* Inner Frame Decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                right: '20%',
                bottom: '20%',
                border: `2px dashed ${currentLevel.color}`,
                opacity: 0.3,
                pointerEvents: 'none',
              }}
            />

            <Typography variant="h3" sx={{ fontWeight: 900, color: currentLevel.color, mb: 1 }}>
              {currentLevel.title}
            </Typography>
            <Typography variant="h6" sx={{ color: '#555', mb: 3, fontWeight: 'bold' }}>
              {currentLevel.subtitle}
            </Typography>
            <Typography variant="body1" sx={{ color: '#333', maxWidth: '80%', mb: 4, fontSize: '1.1rem' }}>
              {currentLevel.text}
            </Typography>

            {currentLevel.action ? (
              <Box sx={{ display: 'flex', gap: 2, zIndex: 10 }}>
                <Button
                  variant="contained"
                  startIcon={<Launch />}
                  onClick={() => window.open('https://burgerfun.tech/infinite-levels/', '_blank')}
                  sx={{ backgroundColor: currentLevel.color }}
                >
                  Play
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GitHub />}
                  onClick={() => window.open('https://github.com/HamburgJ/Infinite-Levels', '_blank')}
                  sx={{ color: currentLevel.color, borderColor: currentLevel.color }}
                >
                  Code
                </Button>
                <IconButton onClick={() => setLevelIndex(0)} sx={{ color: currentLevel.color }}>
                  <Refresh />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="contained"
                endIcon={<ArrowDownward />}
                onClick={nextLevel}
                sx={{
                  backgroundColor: currentLevel.color,
                  '&:hover': { transform: 'scale(1.05)' },
                  zIndex: 10,
                }}
              >
                Go Deeper
              </Button>
            )}
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default ProjectInfiniteLevels;
