import { Typography } from '@mui/material';
import React from 'react';
import WaveContainer from './WaveContainer';

interface PageTitleProps {
  children: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ children }: PageTitleProps) => (
  <WaveContainer>
    <Typography variant='h1' sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, marginTop: { xs: '2rem', sm: '3rem' } }}>
      {children}
    </Typography>
  </WaveContainer>
);

export default PageTitle;
