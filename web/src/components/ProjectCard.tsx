import React from 'react';
import { Card, CardContent, Typography, Button, Stack, Box } from '@mui/material';
import { Project } from '../data/projects';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card 
      sx={{ 
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 2
      }}
    >
      <CardContent sx={{ flex: 1, p: 0 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ color: project.color }}
        >
          {project.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {project.description}
        </Typography>
      </CardContent>

      <Box>
        <Stack spacing={1}>
          <Button
            variant="contained"
            href={project.liveUrl}
            target="_blank"
            startIcon={<LaunchIcon />}
            sx={{
              bgcolor: project.color,
              '&:hover': {
                bgcolor: project.color,
                filter: 'brightness(0.9)'
              }
            }}
          >
            {project.actionText}
          </Button>
          <Button
            variant="outlined"
            href={project.repoUrl}
            target="_blank"
            startIcon={<GitHubIcon />}
            sx={{
              borderColor: 'text.secondary',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'text.primary',
                color: 'text.primary'
              }
            }}
          >
            View Code
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}; 