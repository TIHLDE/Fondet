import React, { useEffect, useState } from 'react';
import { Box, Container, Skeleton, Typography } from '@mui/material';
import PerformanceChart from './components/PerformanceChart';
import PositionsChart from './components/PositionsChart';

// Api
import Api, { NordnetData } from 'api';

const Home: React.FunctionComponent = () => {
  const [nordnetData, setNordnetData] = useState<NordnetData>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Api.Nordnet.get().then((data) => {
      setNordnetData(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Container>
        <Box height={64} />
        <Typography variant='h2' sx={{ mr: 15 }}>
          Fondets avkastning
        </Typography>
        {process.env.NODE_ENV === 'production' ? (
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
              Snart vil fondets avkastning vises her.
            </Typography>
          </Box>
        ) : !loading && nordnetData ? (
          <PerformanceChart nordnetData={nordnetData} />
        ) : (
          <Skeleton variant='rectangular' sx={{ width: '100%', height: '100%', aspectRatio: '16/9' }} animation='wave' />
        )}
        <Box height={64} />
        <Typography variant='h2'>Fondets sammensetning</Typography>
        {process.env.NODE_ENV === 'production' ? (
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
              Snart vil fondets sammensetning vises her.
            </Typography>
          </Box>
        ) : !loading && nordnetData ? (
          <PositionsChart nordnetData={nordnetData} />
        ) : (
          <Skeleton variant='rectangular' sx={{ width: '100%', height: '100%', aspectRatio: '16/9' }} animation='wave' />
        )}
        <Box height={128} />
      </Container>
    </>
  );
};

export default Home;
