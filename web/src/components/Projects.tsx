import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { GitHub, OpenInNew } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';

const Projects: React.FC = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 3, fontWeight: 500 }}
      >
        Projects
      </Typography>
      <Grid container spacing={2}>
        {projects.map((project, index) => (
          <Grid item xs={12} key={project.name}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              elevation={1}
              sx={{
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ color: project.color, fontWeight: 500 }}
                >
                  {project.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<GitHub />}
                    onClick={() => window.open(project.repoUrl, '_blank')}
                    sx={{ 
                      borderColor: project.color,
                      color: project.color,
                      '&:hover': {
                        borderColor: project.color,
                        backgroundColor: `${project.color}10`
                      }
                    }}
                  >
                    Code
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<OpenInNew />}
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    sx={{ 
                      backgroundColor: project.color,
                      '&:hover': {
                        backgroundColor: project.color,
                        filter: 'brightness(0.9)'
                      }
                    }}
                  >
                    {project.actionText}
                  </Button>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {project.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Projects; 