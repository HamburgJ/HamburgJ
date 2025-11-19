import React from 'react';
import { Box, Typography, Paper, Grid, Link, Button } from '@mui/material';
import { Terminal, Launch, GitHub } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';

const workExperiences = [
  {
    company: "Expertise AI",
    role: "Software Developer",
    period: "May 2025 - Present",
    logo: "images/expertise_ai_logo.png",
    description: "Permanent Full-time position.",
    link: "https://expertise.ai",
    featured: true
  },
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
  }
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
              Bachelor of Applied Science (BASc), Computer Engineering
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                opacity: 0.8,
                mt: 0.5,
              }}
            >
              Sep 2020 - Apr 2025
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                opacity: 0.8,
                mt: 0.5,
              }}
            >
              • Graduated with Dean’s Honours
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                opacity: 0.8,
              }}
            >
              • Dean’s Honour List: Fall 2022 (2B), Spring 2024 (4A)
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
                elevation={experience.featured ? 4 : 1}
                onClick={() => experience.link && window.open(experience.link, '_blank')}
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  border: '1px solid',
                  borderColor: experience.featured ? 'rgba(255,255,255,0.1)' : 'rgba(230,235,240,0.9)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: experience.link ? 'pointer' : 'default',
                  background: experience.featured 
                    ? '#000000'
                    : 'white',
                  color: experience.featured ? 'white' : 'inherit',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: experience.featured ? '100%' : '3px',
                    width: experience.featured ? '4px' : '100%',
                    background: experience.featured 
                      ? '#055b4e'
                      : 'linear-gradient(90deg, transparent, #2962ff, transparent)',
                    opacity: experience.featured ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                  },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: experience.featured ? '#055b4e' : 'primary.main',
                    boxShadow: experience.featured 
                      ? '0 8px 32px rgba(5, 91, 78, 0.3)'
                      : '0 8px 24px rgba(0,0,0,0.12)',
                    '&::before': {
                      opacity: 1,
                      boxShadow: experience.featured ? '0 0 15px #055b4e' : 'none'
                    },
                    '& .experience-image': {
                      transform: 'scale(1.05)',
                      filter: 'grayscale(0)'
                    },
                    '& .experience-title': {
                      color: experience.featured ? '#055b4e' : 'primary.main',
                      transform: 'translateX(8px)',
                      textShadow: experience.featured ? '0 0 10px rgba(5, 91, 78, 0.5)' : 'none'
                    },
                    '& .experience-details': {
                      opacity: 1,
                      transform: 'translateY(0)',
                      color: experience.featured ? 'rgba(255,255,255,0.9)' : 'text.secondary'
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
                    filter: experience.featured ? 'none' : 'grayscale(0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    bgcolor: experience.featured ? 'white' : 'transparent',
                    p: experience.featured ? 1 : 0
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      className="experience-title"
                      variant="h6" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 0.5,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: experience.featured ? 'white' : 'text.primary'
                      }}
                    >
                      {experience.company}
                    </Typography>
                    {experience.featured && (
                      <Launch sx={{ fontSize: 16, opacity: 0.7, color: 'white' }} />
                    )}
                  </Box>
                  <Typography 
                    className="experience-details"
                    variant="subtitle1" 
                    sx={{ 
                      color: experience.featured ? 'rgba(255,255,255,0.7)' : 'text.secondary',
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
                      color: experience.featured ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                      opacity: 0.7,
                      mb: 1,
                      transform: 'translateY(4px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {experience.period}
                  </Typography>
                  <Typography 
                    className="experience-details"
                    variant="body2" 
                    sx={{ 
                      color: experience.featured ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                      opacity: 0.9,
                      mb: 1.5,
                      transform: 'translateY(4px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {experience.description}
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
