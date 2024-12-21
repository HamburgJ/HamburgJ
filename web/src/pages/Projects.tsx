import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { ProjectCard } from '../components/ProjectCard';
import { projects } from '../data/projects';

export const Projects: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          component="h1"
          variant="h2"
          color="text.primary"
          gutterBottom
        >
          Projects
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          component="p"
        >
          Check out some of my recent work
        </Typography>
      </Box>

      {projects.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </Container>
  );
}; 