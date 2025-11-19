import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { GitHub, Launch, AutoFixHigh } from '@mui/icons-material';

const TARGET_GRID = [
  ['M', 'A', 'T', 'C', 'H'],
  ['F', 'I', 'V', 'E', '!'],
  ['W', 'O', 'R', 'D', 'S'],
  ['G', 'A', 'M', 'E', 'S'],
  ['R', 'E', 'A', 'C', 'T'],
];

const FLAT_TARGET = TARGET_GRID.flat();

const ProjectMatchFive: React.FC = () => {
  const [tiles, setTiles] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);

  useEffect(() => {
    scramble();
  }, []);

  const scramble = () => {
    const shuffled = [...FLAT_TARGET].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setSolved(false);
  };

  const solve = () => {
    setTiles([...FLAT_TARGET]);
    setSolved(true);
  };

  const handleTileClick = (index: number) => {
    if (solved) return;

    if (selectedTile === null) {
      setSelectedTile(index);
    } else {
      // Swap
      const newTiles = [...tiles];
      const temp = newTiles[selectedTile];
      newTiles[selectedTile] = newTiles[index];
      newTiles[index] = temp;
      setTiles(newTiles);
      setSelectedTile(null);

      // Check if solved
      if (newTiles.join('') === FLAT_TARGET.join('')) {
        setSolved(true);
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 900, color: '#7B1FA2', letterSpacing: 2 }}>
        MATCH FIVE
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 1,
          mb: 4,
          p: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        {tiles.map((letter, i) => (
          <motion.div
            key={i}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: selectedTile === i ? 1.1 : 1,
              opacity: 1,
              backgroundColor: solved ? '#66bb6a' : selectedTile === i ? '#fff59d' : '#ffffff',
              color: solved ? '#ffffff' : '#333333',
            }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleTileClick(i)}
            style={{
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #e0e0e0',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              userSelect: 'none',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            }}
          >
            {letter}
          </motion.div>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AutoFixHigh />}
          onClick={solve}
          disabled={solved}
          sx={{ backgroundColor: '#7B1FA2' }}
        >
          Solve Puzzle
        </Button>
        <Button variant="outlined" onClick={scramble} sx={{ color: '#7B1FA2', borderColor: '#7B1FA2' }}>
          Scramble
        </Button>
      </Box>

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Paper sx={{ p: 3, maxWidth: 400, textAlign: 'center', border: '2px solid #7B1FA2' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#7B1FA2', fontWeight: 'bold' }}>
              Puzzle Solved!
            </Typography>
            <Typography variant="body2" paragraph>
              A word-based puzzle game exploring matching words to their multiple meanings.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<Launch />}
                onClick={() => window.open('https://burgerfun.tech/match-five', '_blank')}
                sx={{ backgroundColor: '#7B1FA2' }}
              >
                Play
              </Button>
              <Button
                variant="outlined"
                startIcon={<GitHub />}
                onClick={() => window.open('https://github.com/HamburgJ/match-five', '_blank')}
                sx={{ color: '#7B1FA2', borderColor: '#7B1FA2' }}
              >
                Code
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

export default ProjectMatchFive;
