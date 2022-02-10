import React, { useEffect, useState } from 'react';
import { Box, Container, Skeleton, Typography } from '@mui/material';
import PerformanceChart from './components/PerformanceChart';
import PositionsChart from './components/PositionsChart';

// Api
import Api, { NordnetData } from 'api';
import PositionsTable from './components/PositionsTable';
import PositionsList from './components/PositionsList';

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
          <>
            <Skeleton variant='rectangular' sx={{ borderRadius: 1, width: '100%', height: '100%', aspectRatio: '16/9' }} animation='wave' />
            <Skeleton variant='rectangular' sx={{ borderRadius: 2, maxWidth: 450, height: '40px', mx: 'auto', mt: 3 }} animation='wave' />
          </>
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
          <>
            <PositionsChart nordnetData={nordnetData} />
            <PositionsTable nordnetData={nordnetData} sx={{ display: { xs: 'none', md: 'block' }, mt: 8 }} />
            <PositionsList nordnetData={nordnetData} sx={{ display: { xs: 'block', md: 'none' }, mt: 4, mx: 'auto', maxWidth: 500 }} />
          </>
        ) : (
          <>
            <Skeleton variant='rectangular' sx={{ borderRadius: 1, width: '100%', height: { xs: 600, md: 400 } }} animation='wave' />
            <Box height={70} />
            {[...Array(8).keys()].map((i) => (
              <Skeleton key={i} variant='text' sx={{ width: '100%', height: '70px', mt: { xs: -2, md: 0 } }} animation='wave' />
            ))}
          </>
        )}
        <Box height={128} />
      </Container>
    </>
  );
};

export default Home;
