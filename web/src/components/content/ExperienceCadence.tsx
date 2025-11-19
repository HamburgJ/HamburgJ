import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Switch, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';

const ExperienceCadence: React.FC = () => {
  const [systemState, setSystemState] = useState({
    embedded: false,
    web: false,
    hardware: false,
    power: true,
  });

  const [logs, setLogs] = useState<string[]>(['SYSTEM INITIALIZED...', 'WAITING FOR INPUT...']);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-4), `> ${msg}`]);
  };

  const handleToggle = (key: keyof typeof systemState) => {
    setSystemState((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      if (newState[key]) {
        addLog(`${key.toUpperCase()} MODULE ACTIVATED`);
      } else {
        addLog(`${key.toUpperCase()} MODULE OFFLINE`);
      }
      return newState;
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#2c3e50',
        backgroundImage: 'linear-gradient(45deg, #2c3e50 25%, #34495e 25%, #34495e 50%, #2c3e50 50%, #2c3e50 75%, #34495e 75%, #34495e 100%)',
        backgroundSize: '20px 20px',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Roboto Mono", monospace',
      }}
    >
      {/* Main Panel */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '800px',
          backgroundColor: '#bdc3c7',
          border: '4px solid #7f8c8d',
          borderRadius: 2,
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3)',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* Header Plate */}
        <Box
          sx={{
            backgroundColor: '#2c3e50',
            p: 2,
            borderRadius: 1,
            border: '2px solid #34495e',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" sx={{ color: '#ecf0f1', fontWeight: 'bold', letterSpacing: 2 }}>
            CADENCE AG. SYSTEMS
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#ecf0f1' }}>PWR</Typography>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: systemState.power ? '#2ecc71' : '#c0392b',
                boxShadow: systemState.power ? '0 0 10px #2ecc71' : 'none',
              }}
            />
          </Box>
        </Box>

        {/* LCD Display */}
        <Box
          sx={{
            backgroundColor: '#000',
            border: '4px solid #555',
            borderRadius: 1,
            p: 2,
            height: '150px',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: '"Courier New", monospace',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(46, 204, 113, 0.1)',
              pointerEvents: 'none',
            }}
          />
          {logs.map((log, i) => (
            <Typography key={i} variant="body1" sx={{ color: '#2ecc71', textShadow: '0 0 5px rgba(46, 204, 113, 0.5)' }}>
              {log}
            </Typography>
          ))}
          
          {/* Dynamic Content based on switches */}
          <Box sx={{ mt: 2, borderTop: '1px dashed #2ecc71', pt: 1 }}>
            {systemState.embedded && (
              <Typography variant="body2" sx={{ color: '#2ecc71' }}>
                [EMBEDDED]: Bridged hardware & software. Real-time data processing.
              </Typography>
            )}
            {systemState.web && (
              <Typography variant="body2" sx={{ color: '#2ecc71' }}>
                [WEB]: Developed transportation management interfaces.
              </Typography>
            )}
            {systemState.hardware && (
              <Typography variant="body2" sx={{ color: '#2ecc71' }}>
                [HARDWARE]: Reliability testing & system integration.
              </Typography>
            )}
          </Box>
        </Box>

        {/* Controls Area */}
        <Grid container spacing={4}>
          {/* Switch Group 1 */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                border: '2px solid #95a5a6',
                borderRadius: 1,
                p: 2,
                backgroundColor: '#dcdcdc',
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#7f8c8d', fontWeight: 'bold' }}>
                MODULE CONTROL
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemState.embedded}
                      onChange={() => handleToggle('embedded')}
                      color="success"
                    />
                  }
                  label="EMBEDDED"
                  sx={{ flexDirection: 'column-reverse', gap: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemState.web}
                      onChange={() => handleToggle('web')}
                      color="primary"
                    />
                  }
                  label="WEB UI"
                  sx={{ flexDirection: 'column-reverse', gap: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemState.hardware}
                      onChange={() => handleToggle('hardware')}
                      color="warning"
                    />
                  }
                  label="HARDWARE"
                  sx={{ flexDirection: 'column-reverse', gap: 1 }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Gauge / Status */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                border: '2px solid #95a5a6',
                borderRadius: 1,
                p: 2,
                backgroundColor: '#dcdcdc',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#7f8c8d', fontWeight: 'bold' }}>
                SYSTEM LOAD
              </Typography>
              <Box
                sx={{
                  width: 80,
                  height: 40,
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
                  border: '4px solid #34495e',
                  borderBottom: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#ecf0f1',
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 45, 20, 80, 30] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
                  style={{
                    width: 4,
                    height: 35,
                    backgroundColor: '#c0392b',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transformOrigin: 'bottom center',
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ mt: 1, fontFamily: 'monospace' }}>
                OPTIMAL
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Plate */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
            SERIAL NO: CAS-2021-2022 // INTERN UNIT
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ExperienceCadence;
