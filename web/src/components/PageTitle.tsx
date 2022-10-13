import { Typography } from '@mui/material';
import React from 'react';
import WaveContainer from './WaveContainer';

interface PageTitleProps {
  children: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ children }) => (
  <WaveContainer>
    <Typography variant='h1' sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, marginTop: { xs: '0.5rem', sm: '1rem', md: '1.5rem' } }}>
      {children}
    </Typography>
  </WaveContainer>
);

export default PageTitle;
