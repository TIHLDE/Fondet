import React, { useEffect, useState } from 'react';
import { Box, Container, Skeleton, Typography } from '@mui/material';
import PerformanceChart from './components/PerformanceChart';
import PositionsChart from './components/PositionsChart';

// Api
import Api, { NordnetData } from 'api';

// Components
import PositionsTable from './components/PositionsTable';
import PositionsList from './components/PositionsList';
import FantasyWidget from './components/FantasyWidget';

const Home: React.FunctionComponent = () => {
  const [nordnetData, setNordnetData] = useState<NordnetData>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([Api.Nordnet.get(), Api.Fantasyfund.get()]).then(([nordnet]) => {
      setNordnetData(nordnet);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Container>
        {process.env.REACT_APP_ENV === 'development' && <FantasyWidget />}
        <Box height={64} />
        <Typography variant='h2' sx={{ mr: { xs: 13, sm: 15 } }}>
          Fondets avkastning
        </Typography>

        {!loading && nordnetData ? (
          <PerformanceChart nordnetData={nordnetData} />
        ) : (
          <>
            <Skeleton variant='rectangular' sx={{ borderRadius: 1, width: '100%', height: '100%', aspectRatio: '16/9' }} animation='wave' />
            <Skeleton variant='rectangular' sx={{ borderRadius: 2, maxWidth: 450, height: '40px', mx: 'auto', mt: 3 }} animation='wave' />
          </>
        )}
        <Box height={64} />
        <Typography variant='h2'>Fondets sammensetning</Typography>

        {!loading && nordnetData ? (
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
              <Skeleton key={i} variant='rectangular' height={50} sx={{ mb: { xs: 1, md: 2 }, borderRadius: 1 }} animation='wave' />
            ))}
          </>
        )}
        <Box height={128} />
      </Container>
    </>
  );
};

export default Home;
