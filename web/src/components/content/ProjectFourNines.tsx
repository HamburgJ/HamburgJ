import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { GitHub, Launch, Refresh } from '@mui/icons-material';

const ProjectFourNines: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isErased, setIsErased] = useState(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with Chalkboard Green
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add Noise/Texture
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }

    // Write Initial Equation
    ctx.font = 'bold 80px "Segoe UI", cursive';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('9 + 9 + 9 + 9 = ?', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '30px "Segoe UI", cursive';
    ctx.fillText('(Drag to Erase)', canvas.width / 2, canvas.height / 2 + 80);

    setIsErased(false);
  };

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, []);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();

    // Check if enough is erased to show controls (simplified check)
    if (!isErased) setIsErased(true);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1e3c1b', // Darker green for background
        userSelect: 'none',
      }}
    >
      {/* Hidden Content (Revealed by erasing) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontFamily: '"Segoe UI", cursive', mb: 2 }}>
          Four Nines
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, maxWidth: '600px' }}>
          A daily mathematical game where you craft expressions using exactly four digits to reach the target number.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Launch />}
            onClick={() => window.open('https://burgerfun.tech/four-nines/', '_blank')}
            sx={{ backgroundColor: '#fff', color: '#1e3c1b', '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            Play Daily
          </Button>
          <Button
            variant="outlined"
            startIcon={<GitHub />}
            onClick={() => window.open('https://github.com/HamburgJ/four-nines-game', '_blank')}
            sx={{ color: '#fff', borderColor: '#fff', '&:hover': { borderColor: '#e0e0e0', backgroundColor: 'rgba(255,255,255,0.1)' } }}
          >
            Code
          </Button>
          <Button
            variant="text"
            startIcon={<Refresh />}
            onClick={initCanvas}
            sx={{ color: '#fff' }}
          >
            Reset Board
          </Button>
        </Box>
      </Box>

      {/* Scratch Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleMouseMove(e);
        }}
        onTouchMove={handleMouseMove}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      />
    </Box>
  );
};

export default ProjectFourNines;
