import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  description: string;
}

const nodes: Node[] = [
  { id: 'ai', label: 'AI / ML', x: 20, y: 30, color: '#FF6B6B', description: 'Leveraged machine learning models to analyze large-scale social data.' },
  { id: 'social', label: 'Social Impact', x: 70, y: 20, color: '#4ECDC4', description: 'Built tools to visualize and interpret complex datasets for social impact organizations.' },
  { id: 'viz', label: 'Visualization', x: 50, y: 60, color: '#FFE66D', description: 'Created intuitive dashboards to make data accessible.' },
  { id: 'python', label: 'Python', x: 30, y: 80, color: '#1A535C', description: 'Utilized Python for data processing and backend logic.' },
  { id: 'intern', label: 'Internship', x: 80, y: 80, color: '#F7FFF7', description: 'Jan 2021 - Apr 2021. AI/ML Software Engineering Intern.' },
];

const ExperienceQuiltAI: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [connections, setConnections] = useState<string[]>([]);

  const handleNodeClick = (node: Node) => {
    if (selectedNode && selectedNode.id !== node.id) {
      setConnections((prev) => [...prev, `${selectedNode.id}-${node.id}`]);
    }
    setSelectedNode(node);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#222',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* SVG Connections */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {connections.map((conn, i) => {
          const [id1, id2] = conn.split('-');
          const n1 = nodes.find((n) => n.id === id1);
          const n2 = nodes.find((n) => n.id === id2);
          if (!n1 || !n2) return null;
          return (
            <motion.line
              key={i}
              x1={`${n1.x}%`}
              y1={`${n1.y}%`}
              x2={`${n2.x}%`}
              y2={`${n2.y}%`}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            y: ['-50%', '-60%', '-50%'],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Box
            onClick={() => handleNodeClick(node)}
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: node.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: selectedNode?.id === node.id ? '0 0 20px rgba(255,255,255,0.5)' : '0 5px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.1)' },
              textAlign: 'center',
              p: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
              {node.label}
            </Typography>
          </Box>
        </motion.div>
      ))}

      {/* Info Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              x: '-50%',
              width: '80%',
              maxWidth: '600px',
            }}
          >
            <Paper
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `2px solid ${selectedNode.color}`,
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
                {selectedNode.label}
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                {selectedNode.description}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#888' }}>
                Click another node to weave a connection.
              </Typography>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, pointerEvents: 'none' }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 300, letterSpacing: 4 }}>
          QUILT.AI
        </Typography>
      </Box>
    </Box>
  );
};

export default ExperienceQuiltAI;
