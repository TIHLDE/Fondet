import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Home: React.FunctionComponent = () => (
  <>
    <Container>
      <Box
        sx={{
          mt: 16,
          width: '100%',
          aspectRatio: '16/9',
          border: '0.5px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <Typography variant='body1' textAlign='center' sx={{ p: 5 }}>
          Her kommer oversikt over avkastningen når hs bestemmer seg for å gi oss pengene.
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 8,
          width: '100%',
          aspectRatio: '16/9',
          border: '0.5px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <Typography variant='body1' textAlign='center' sx={{ p: 5 }}>
          Her kommer oversikt over fondets sammensetning når hs bestemmer seg for å gi oss pengene.
        </Typography>
      </Box>
      <Box height={150} />
    </Container>
  </>
);

export default Home;
