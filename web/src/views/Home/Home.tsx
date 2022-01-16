import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Home: React.FunctionComponent = () => (
  <>
    <Container>
      <Box height={64} />
      <Typography variant='h2'>Fondets avkastning</Typography>
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16/9',
          border: '0.5px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <Typography variant='body1' textAlign='center' sx={{ p: 5 }}>
          Når fondet får sin første overføring vises avkastningen her.
        </Typography>
      </Box>
      <Box height={64} />
      <Typography variant='h2'>Fondets sammensetning</Typography>
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16/9',
          border: '0.5px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <Typography variant='body1' textAlign='center' sx={{ p: 5 }}>
          Når fondet får sin første overføring vises sammensetningen her.
        </Typography>
      </Box>
      <Box height={128} />
    </Container>
  </>
);

export default Home;
