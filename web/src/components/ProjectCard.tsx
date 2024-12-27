import React from 'react';
import { Card, CardContent, Typography, Button, styled } from '@mui/material';
import { Project } from '../data/projects';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import { SxProps, Theme } from '@mui/material/styles';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
}

const ProjectContainer = styled(motion(Card))(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
  alignItems: 'center',
  gap: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, transparent, currentColor, transparent)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  '&:hover::before': {
    opacity: 0.5,
  }
}));

const Content = styled(CardContent)(({ theme }) => ({
  flex: 1,
  padding: 0,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateX(8px)'
  }
}));

const ButtonGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}));

interface ActionButtonProps {
  href: string;
  icon: React.ReactNode;
  color?: string;
  variant: 'contained' | 'outlined';
  children: React.ReactNode;
}

const getButtonStyles = (variant: 'contained' | 'outlined', color?: string): SxProps<Theme> => {
  if (variant === 'contained') {
    return {
      backgroundColor: color,
      transition: 'all 0.2s ease-in-out',
      transform: 'translateZ(0)',
      '&:hover': {
        backgroundColor: color,
        filter: 'brightness(0.9)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      },
      '&:active': {
        transform: 'translateY(0)'
      }
    };
  }
  return {
    borderColor: 'text.secondary',
    color: 'text.secondary',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: 'text.primary',
      color: 'text.primary',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  };
};

const ActionButton: React.FC<ActionButtonProps> = ({ href, icon, color, variant, children }) => (
  <Button
    component={motion.a}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    variant={variant}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    startIcon={icon}
    sx={getButtonStyles(variant, color)}
  >
    {children}
  </Button>
);

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <ProjectContainer
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    whileHover={{ 
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      translateY: -4
    }}
  >
    <Content>
      <Typography 
        variant="h5" 
        component={motion.h2}
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1, x: 4 }}
        gutterBottom 
        sx={{ 
          color: project.color,
          transition: 'color 0.3s ease',
          cursor: 'default'
        }}
      >
        {project.name}
      </Typography>
      <Typography 
        variant="body1" 
        component={motion.p}
        initial={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
        color="text.secondary"
      >
        {project.description}
      </Typography>
    </Content>

    <ButtonGroup>
      <ActionButton
        href={project.liveUrl}
        icon={<LaunchIcon />}
        color={project.color}
        variant="contained"
      >
        {project.actionText}
      </ActionButton>
      <ActionButton
        href={project.repoUrl}
        icon={<GitHubIcon />}
        variant="outlined"
      >
        View Code
      </ActionButton>
    </ButtonGroup>
  </ProjectContainer>
); 