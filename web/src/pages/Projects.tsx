import React from 'react';
import { Container, Typography, Box, SxProps, Theme } from '@mui/material';
import { ProjectCard } from '../components/ProjectCard';
import { projects } from '../data/projects';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)({
  paddingTop: 64,
  paddingBottom: 64,
});

const HeaderBox = styled(Box)({
  marginBottom: 48,
  textAlign: 'center',
});

export const Projects: React.FC = () => {
  return (
    <StyledContainer maxWidth="lg">
      <HeaderBox>
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
      </HeaderBox>

      {projects.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </StyledContainer>
  );
}; 