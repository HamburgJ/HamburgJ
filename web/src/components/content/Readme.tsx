import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const Readme: React.FC = () => {
  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h3" gutterBottom sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
        # README.md
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Welcome to my digital workspace. This portfolio is designed to reflect my approach to software engineering: structured, clean, and user-centric.
      </Typography>

      <Divider sx={{ my: 4, borderColor: '#000000' }} />

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        ## About Me
      </Typography>
      
      <Typography variant="body1" paragraph>
        I am Joshua Hamburger, a Software Developer at Expertise AI and a Computer Engineering graduate from the University of Waterloo.
      </Typography>

      <Typography variant="body1" paragraph>
        I specialize in building full-stack applications, with a focus on creating intuitive user experiences and robust backend systems. My passion lies in turning complex problems into elegant, maintainable code.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        ## Navigation
      </Typography>

      <Typography variant="body1" paragraph>
        Use the **File Explorer** on the left to navigate through my background:
      </Typography>

      <Box component="ul" sx={{ pl: 2 }}>
        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
          <strong>/Education</strong>: My academic journey and achievements.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
          <strong>/Experience</strong>: Professional roles and contributions.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
          <strong>/Projects</strong>: Personal and academic projects I've built.
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ mt: 4, fontStyle: 'italic', color: 'text.secondary' }}>
        &gt; "The best way to predict the future is to invent it."
      </Typography>
    </Box>
  );
};

export default Readme;

