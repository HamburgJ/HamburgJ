import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { LocalShipping, Place, Description, Close } from '@mui/icons-material';

interface Shipment {
  id: string;
  from: { x: number; y: number; name: string };
  to: { x: number; y: number; name: string };
  status: string;
  details: string;
  duration: number;
}

const shipments: Shipment[] = [
  {
    id: 'PKG-001',
    from: { x: 200, y: 300, name: 'Warehouse A' },
    to: { x: 600, y: 200, name: 'Distribution Center' },
    status: 'IN_TRANSIT',
    details: 'Full-Stack Development: Worked on logistics and supply chain management software.',
    duration: 4,
  },
  {
    id: 'PKG-002',
    from: { x: 600, y: 200, name: 'Distribution Center' },
    to: { x: 800, y: 400, name: 'Client Site' },
    status: 'DELIVERED',
    details: 'Scalability: Contributed to the development of scalable web applications using modern frameworks.',
    duration: 3,
  },
  {
    id: 'PKG-003',
    from: { x: 200, y: 300, name: 'Warehouse A' },
    to: { x: 400, y: 500, name: 'Regional Hub' },
    status: 'PROCESSING',
    details: 'Collaboration: Collaborated with cross-functional teams to deliver high-quality software solutions.',
    duration: 5,
  },
];

const ExperienceDescartes: React.FC = () => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#e0f7fa', // Light blue water
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Roboto", sans-serif',
      }}
    >
      {/* Map Background (Simplified Continents) */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, opacity: 0.5 }}
      >
        {/* Landmasses */}
        <path
          d="M100,100 Q200,50 300,150 T500,200 T700,150 T900,250 V500 H100 Z"
          fill="#c8e6c9" // Light green land
          stroke="#81c784"
          strokeWidth="2"
        />
        {/* Routes */}
        {shipments.map((shipment) => (
          <line
            key={`route-${shipment.id}`}
            x1={shipment.from.x}
            y1={shipment.from.y}
            x2={shipment.to.x}
            y2={shipment.to.y}
            stroke="#b0bec5"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        ))}
      </svg>

      {/* Cities */}
      {shipments.flatMap(s => [s.from, s.to]).map((city, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: city.x,
            top: city.y,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Place sx={{ color: '#d32f2f', fontSize: 24 }} />
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#455a64' }}>
            {city.name}
          </Typography>
        </Box>
      ))}

      {/* Moving Packages */}
      {shipments.map((shipment) => (
        <motion.div
          key={shipment.id}
          initial={{ x: shipment.from.x, y: shipment.from.y }}
          animate={{ x: shipment.to.x, y: shipment.to.y }}
          transition={{
            duration: shipment.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 10,
          }}
          onClick={() => setSelectedShipment(shipment)}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              backgroundColor: '#1976d2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              border: '2px solid white',
              '&:hover': { transform: 'scale(1.2)' },
            }}
          >
            <LocalShipping sx={{ color: 'white', fontSize: 16 }} />
          </Box>
        </motion.div>
      ))}

      {/* Header Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          backgroundColor: 'rgba(255,255,255,0.9)',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #b0bec5',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Descartes Systems Group
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Global Logistics Network
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Click a moving shipment to view manifest.
        </Typography>
      </Box>

      {/* Manifest Side Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: selectedShipment ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '350px',
          backgroundColor: '#ffffff',
          boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
          zIndex: 20,
        }}
      >
        {selectedShipment && (
          <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description /> Manifest
              </Typography>
              <IconButton onClick={() => setSelectedShipment(null)}>
                <Close />
              </IconButton>
            </Box>

            <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="caption" color="text.secondary">
                SHIPMENT ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                {selectedShipment.id}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="caption" color="text.secondary">
                STATUS
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  color: selectedShipment.status === 'DELIVERED' ? 'green' : 'orange',
                }}
              >
                {selectedShipment.status}
              </Typography>
            </Paper>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                CARGO DETAILS
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {selectedShipment.details}
              </Typography>
            </Box>

            <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                Descartes Logistics System v4.2
              </Typography>
            </Box>
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default ExperienceDescartes;
