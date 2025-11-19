import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, TextField, Grid } from '@mui/material';
import { motion } from 'framer-motion';

interface CommandHistory {
  type: 'input' | 'output';
  content: string;
}

const ExperienceExpertiseAI: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    { type: 'output', content: 'Expertise AI Neural Terminal v2.0.5' },
    { type: 'output', content: 'Connected to secure server...' },
    { type: 'output', content: 'Type "help" for available commands.' },
  ]);
  const [visualMode, setVisualMode] = useState<'idle' | 'role' | 'stack' | 'impact'>('idle');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: 'input' as const, content: cmd }];

    switch (cleanCmd) {
      case 'help':
        newHistory.push({ type: 'output', content: 'Available commands: role, stack, impact, clear' });
        break;
      case 'role':
        newHistory.push({ type: 'output', content: 'Loading role configuration...' });
        setVisualMode('role');
        break;
      case 'stack':
        newHistory.push({ type: 'output', content: 'Analyzing tech stack...' });
        setVisualMode('stack');
        break;
      case 'impact':
        newHistory.push({ type: 'output', content: 'Calculating system impact...' });
        setVisualMode('impact');
        break;
      case 'clear':
        setHistory([]);
        setVisualMode('idle');
        setInput('');
        return;
      default:
        newHistory.push({ type: 'output', content: `Command not found: ${cleanCmd}` });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        color: '#00ff00',
        fontFamily: '"Courier New", monospace',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 2px, 3px 100%',
          pointerEvents: 'none',
          zIndex: 10,
        },
      }}
    >
      <Grid container sx={{ flex: 1, height: '100%' }}>
        {/* Left: Terminal */}
        <Grid item xs={12} md={6} sx={{ borderRight: '1px solid #003300', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            {history.map((entry, i) => (
              <Typography
                key={i}
                variant="body2"
                sx={{
                  fontFamily: '"Courier New", monospace',
                  color: entry.type === 'input' ? '#ffffff' : '#00ff00',
                  mb: 0.5,
                  textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
                }}
              >
                {entry.type === 'input' ? '> ' : ''}{entry.content}
              </Typography>
            ))}
            <div ref={bottomRef} />
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid #003300' }}>
            <TextField
              fullWidth
              variant="standard"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command..."
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: '#ffffff',
                  fontFamily: '"Courier New", monospace',
                  '&::before': { content: '"> "', color: '#00ff00', mr: 1 },
                },
              }}
              autoFocus
            />
          </Box>
        </Grid>

        {/* Right: Visual Output */}
        <Grid item xs={12} md={6} sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(0,50,0,0.2) 0%, rgba(0,0,0,1) 90%)',
              zIndex: 0,
            }}
          />
          
          <motion.div
            key={visualMode}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ zIndex: 1, width: '100%' }}
          >
            {visualMode === 'idle' && (
              <Box sx={{ textAlign: 'center', opacity: 0.5 }}>
                <Typography variant="h2" sx={{ fontFamily: '"Courier New", monospace', mb: 2 }}>
                  SYSTEM READY
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: '"Courier New", monospace' }}>
                  Awaiting input...
                </Typography>
              </Box>
            )}

            {visualMode === 'role' && (
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(0, 20, 0, 0.9)',
                  border: '1px solid #00ff00',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
                  color: '#00ff00',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontFamily: '"Courier New", monospace', borderBottom: '1px solid #00ff00' }}>
                  // ROLE_CONFIG
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontFamily: '"Courier New", monospace' }}>
                  TARGET: Software Developer
                  <br />
                  ORG: Expertise AI
                  <br />
                  STATUS: Active (May 2025 - Present)
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: '"Courier New", monospace' }}>
                  MISSION: Building the future of AI (the helpful kind). Working on cutting-edge solutions to empower businesses.
                </Typography>
              </Paper>
            )}

            {visualMode === 'stack' && (
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(0, 20, 0, 0.9)',
                  border: '1px solid #00ff00',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
                  color: '#00ff00',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontFamily: '"Courier New", monospace', borderBottom: '1px solid #00ff00' }}>
                  // TECH_STACK_ANALYSIS
                </Typography>
                <Grid container spacing={2}>
                  {['React', 'TypeScript', 'Python', 'TensorFlow', 'AWS', 'Node.js'].map((tech) => (
                    <Grid item xs={6} key={tech}>
                      <Box sx={{ border: '1px solid #005500', p: 1, textAlign: 'center' }}>
                        {tech}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {visualMode === 'impact' && (
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(0, 20, 0, 0.9)',
                  border: '1px solid #00ff00',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
                  color: '#00ff00',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontFamily: '"Courier New", monospace', borderBottom: '1px solid #00ff00' }}>
                  // IMPACT_REPORT
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: '"Courier New", monospace' }}>
                  - Developing scalable AI solutions
                  <br />
                  - Optimizing model inference times
                  <br />
                  - Enhancing user-AI interaction patterns
                </Typography>
              </Paper>
            )}
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExperienceExpertiseAI;
