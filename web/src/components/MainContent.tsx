import React from 'react';
import { Box, Typography, Paper, Grid, Link, Button } from '@mui/material';
import { Terminal, Launch, GitHub } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';

const workExperiences = [
{
    company: "Descartes Systems Group Inc",
    role: "Full-Stack Software Engineering Intern",
    period: "Jan 2024 - Apr 2024",
    logo: "images/descartes_systems_group_logo.jpg",
    description: "Worked on logistics and supply chain management software"
    },
    {
        company: "CharityCAN",
        role: "Full-Stack Software Engineering Intern",
        period: "May 2022 - Aug 2022, Jan 2023 - Apr 2023",
        logo: "images/charitycan_logo.jpg",
        description: "Built fundraising analytics and donor management solutions"
      },
{
    company: "Cadence Agriculture Systems Inc",
    role: "Full-Stack/Embedded Software Engineering Intern",
    period: "Sept 2021 - Apr 2022",
    logo: "images/1660839913252.jpg",
    description: "Developed transportation management solutions"
    },
  {
    company: "Quilt.AI",
    role: "AI/ML Software Engineering Intern",
    period: "Jan 2021 - Apr 2021",
    logo: "images/quiltdotai_logo.jpg",
    description: "Developed AI-powered social impact analysis tools"
  },
  
];

const MainContent: React.FC = () => {
  return (
    <Box sx={{ mb: 6 }}>
      {/* Education Section */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        elevation={1}
        sx={{ 
          p: 3,
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2962ff, #768fff)',
          }
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&::before': {
              content: '"> "',
              color: 'primary.main',
              fontFamily: '"JetBrains Mono", monospace',
            }
          }}
        >
          Education
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            component="img"
            src="images/University_of_Waterloo_seal.svg.png"
            alt="University of Waterloo"
            sx={{
              width: 60,
              height: 60,
              objectFit: 'contain',
              filter: 'grayscale(0.2)',
            }}
          />
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              University of Waterloo
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'text.secondary',
                opacity: 0.9,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.9rem',
              }}
            >
      
              4th Year Computer Engineering
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Projects Section */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        elevation={1}
        sx={{ 
          p: 3,
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2962ff, #768fff)',
          }
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&::before': {
              content: '"> "',
              color: 'primary.main',
              fontFamily: '"JetBrains Mono", monospace',
            }
          }}
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
                  border: '1px solid',
                  borderColor: 'rgba(230,235,240,0.9)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                  },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: project.color,
                    boxShadow: `0 8px 24px rgba(0,0,0,0.12)`,
                    '&::before': {
                      opacity: 1
                    },
                    '& .project-title': {
                      transform: 'translateX(8px)',
                      color: project.color
                    },
                    '& .project-description': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography 
                    className="project-title"
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
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
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          borderColor: project.color,
                          backgroundColor: `${project.color}10`,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      Code
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Launch />}
                      onClick={() => window.open(project.liveUrl, '_blank')}
                      sx={{ 
                        backgroundColor: project.color,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: project.color,
                          filter: 'brightness(0.9)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      {project.actionText}
                    </Button>
                  </Box>
                </Box>
                <Typography 
                  className="project-description"
                  variant="body1" 
                  color="text.secondary"
                  sx={{
                    opacity: 0.85,
                    transform: 'translateY(4px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {project.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Work Experience Section */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        elevation={1}
        sx={{ 
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2962ff, #768fff)',
          }
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&::before': {
              content: '"> "',
              color: 'primary.main',
              fontFamily: '"JetBrains Mono", monospace',
            }
          }}
        >
          Work Experience
        </Typography>
        <Grid container spacing={3}>
          {workExperiences.map((experience, index) => (
            <Grid item xs={12} key={index}>
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
                  alignItems: 'center',
                  gap: 3,
                  border: '1px solid',
                  borderColor: 'rgba(230,235,240,0.9)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #2962ff, transparent)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                  },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'primary.main',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    '&::before': {
                      opacity: 1
                    },
                    '& .experience-image': {
                      transform: 'scale(1.05)',
                      filter: 'grayscale(0)'
                    },
                    '& .experience-title': {
                      color: 'primary.main',
                      transform: 'translateX(8px)'
                    },
                    '& .experience-details': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                <Box
                  component="img"
                  className="experience-image"
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'contain',
                    borderRadius: 1,
                    filter: 'grayscale(0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    className="experience-title"
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 0.5,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {experience.company}
                  </Typography>
                  <Typography 
                    className="experience-details"
                    variant="subtitle1" 
                    sx={{ 
                      color: 'text.secondary',
                      mb: 0.5,
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.9rem',
                      opacity: 0.85,
                      transform: 'translateY(4px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {experience.role}
                  </Typography>
                  <Typography 
                    className="experience-details"
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      opacity: 0.7,
                      mb: 1,
                      transform: 'translateY(4px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {experience.period}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default MainContent; 