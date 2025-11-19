import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, Modal, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Close, School, EmojiEvents, Code, Architecture, Storage, Hub, Terminal } from '@mui/icons-material';

// --- Types ---
interface NodeData {
  id: string;
  label: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  details: {
    title: string;
    description: string;
    stats?: string[];
  };
  connections: string[]; // IDs of nodes this node connects TO
}

// --- Data ---
const nodes: NodeData[] = [
  {
    id: 'root',
    label: 'UWaterloo',
    icon: <School sx={{ fontSize: 40 }} />,
    x: 400,
    y: 300,
    details: {
      title: 'University of Waterloo',
      description: 'Bachelor of Applied Science (BASc), Computer Engineering. Sep 2020 - Apr 2025.',
      stats: ['Graduated with Dean’s Honours', 'Co-op Program'],
    },
    connections: ['honours', 'courses'],
  },
  {
    id: 'honours',
    label: 'Honours',
    icon: <EmojiEvents sx={{ fontSize: 30 }} />,
    x: 200,
    y: 150,
    details: {
      title: 'Academic Achievements',
      description: 'Recognized for outstanding academic performance.',
      stats: ['Dean’s Honour List: Fall 2022 (2B)', 'Dean’s Honour List: Spring 2024 (4A)'],
    },
    connections: [],
  },
  {
    id: 'courses',
    label: 'Modules',
    icon: <Architecture sx={{ fontSize: 30 }} />,
    x: 600,
    y: 150,
    details: {
      title: 'Core Coursework',
      description: 'Foundational and advanced engineering modules.',
    },
    connections: ['algo', 'os', 'dist', 'db', 'ai'],
  },
  {
    id: 'algo',
    label: 'Algorithms',
    icon: <Code />,
    x: 750,
    y: 50,
    details: {
      title: 'Algorithms & Data Structures',
      description: 'Advanced study of efficient algorithms and data organization.',
    },
    connections: [],
  },
  {
    id: 'os',
    label: 'OS',
    icon: <Terminal />,
    x: 800,
    y: 120,
    details: {
      title: 'Operating Systems',
      description: 'Kernel design, concurrency, memory management, and file systems.',
    },
    connections: [],
  },
  {
    id: 'dist',
    label: 'Distributed',
    icon: <Hub />,
    x: 800,
    y: 200,
    details: {
      title: 'Distributed Systems',
      description: 'Scalable system design, consensus protocols, and fault tolerance.',
    },
    connections: [],
  },
  {
    id: 'db',
    label: 'Databases',
    icon: <Storage />,
    x: 750,
    y: 280,
    details: {
      title: 'Database Systems',
      description: 'Relational theory, SQL optimization, and transaction management.',
    },
    connections: [],
  },
  {
    id: 'ai',
    label: 'AI',
    icon: <School />, // Reusing school icon or finding a brain one if available
    x: 650,
    y: 320,
    details: {
      title: 'Artificial Intelligence',
      description: 'Machine learning fundamentals, neural networks, and search strategies.',
    },
    connections: [],
  },
];

const EducationWaterloo: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const constraintsRef = useRef(null);

  return (
    <Box
      ref={constraintsRef}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a192f', // Blueprint Blue
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <motion.div
        drag
        dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformOrigin: 'center',
        }}
      >
        {/* SVG Layer for Connections */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {nodes.map((node) =>
            node.connections.map((targetId) => {
              const target = nodes.find((n) => n.id === targetId);
              if (!target) return null;
              return (
                <motion.line
                  key={`${node.id}-${targetId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
              );
            })
          )}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              x: '-50%', // Center the node
              y: '-50%',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedNode(node)}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: '2px solid #ffffff',
                  backgroundColor: '#112240',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64ffda', // Cyan accent
                  boxShadow: '0 0 15px rgba(100, 255, 218, 0.2)',
                  mb: 1,
                }}
              >
                {node.icon}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#ffffff',
                  fontFamily: '"JetBrains Mono", monospace',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  px: 1,
                  borderRadius: 1,
                }}
              >
                {node.label}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <Modal
            open={!!selectedNode}
            onClose={() => setSelectedNode(null)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
            >
              <Paper
                sx={{
                  width: 400,
                  p: 3,
                  backgroundColor: '#0a192f',
                  border: '2px solid #64ffda',
                  color: '#ffffff',
                  position: 'relative',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                <IconButton
                  onClick={() => setSelectedNode(null)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: '#64ffda',
                  }}
                >
                  <Close />
                </IconButton>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#64ffda',
                    mb: 2,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 700,
                  }}
                >
                  {selectedNode.details.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                  {selectedNode.details.description}
                </Typography>
                {selectedNode.details.stats && (
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {selectedNode.details.stats.map((stat, index) => (
                      <Typography
                        key={index}
                        component="li"
                        variant="body2"
                        sx={{ color: '#8892b0', mb: 0.5 }}
                      >
                        {stat}
                      </Typography>
                    ))}
                  </Box>
                )}
                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: '1px dashed rgba(100, 255, 218, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#8892b0' }}>
                    ID: {selectedNode.id.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8892b0' }}>
                    STATUS: VERIFIED
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Instructions Overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          pointerEvents: 'none',
          opacity: 0.7,
        }}
      >
        <Typography variant="caption" sx={{ color: '#ffffff', fontFamily: '"JetBrains Mono", monospace' }}>
          [DRAG TO PAN] [CLICK NODES FOR DETAILS]
        </Typography>
      </Box>
    </Box>
  );
};

export default EducationWaterloo;
