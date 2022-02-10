import React, { useEffect, useState } from 'react';

import { Box, Container, Skeleton, Typography } from '@mui/material';
import PageTitle from 'components/PageTitle';
import Api, { SheetsData } from 'api';
import BigAvatar from './components/BigAvatar';
import PreviousYear from './components/PreviousYear';
import BigSkeleton from './components/BigSkeleton';

const Group: React.FunctionComponent = () => {
  const [sheets, setSheets] = useState<SheetsData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Api.Sheets.get().then((s) => {
      setSheets(s);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageTitle>Forvaltningsgruppen</PageTitle>
      <Container>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 4, lg: 6 },
            gridTemplateColumns:
              sheets?.currentMembers.length === 5 || loading
                ? { sx: '1fr', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }
                : { sx: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gridTemplateAreas:
              sheets?.currentMembers.length === 5 || loading
                ? {
                    xs: '',
                    sm: `"a1 a1 a2 a2"
                   "a3 a3 a4 a4"
                    ". a5 a5 ."`,
                    md: `". a1 a1 a2 a2 ."
                  "a3 a3 a4 a4 a5 a5"`,
                  }
                : {},
            mb: 10,
          }}>
          {!loading
            ? sheets?.currentMembers.map((member, i) => (
                <BigAvatar key={i} member={member} sx={{ gridArea: sheets.currentMembers.length === 5 ? { xs: '', sm: `a${i + 1}` } : {} }} />
              ))
            : [...Array(5).keys()].map((i) => <BigSkeleton key={i} sx={{ gridArea: { xs: '', sm: `a${i + 1}` } }} />)}
        </Box>
        <Typography variant='h2'>Tidligere medlemmer</Typography>
        {!loading && sheets ? (
          Object.keys(sheets.previousMembers).length > 0 ? (
            <div>
              {Object.entries(sheets.previousMembers).map(([year, members], i) => (
                <PreviousYear key={i} year={year} members={members} />
              ))}
            </div>
          ) : (
            <Typography variant='body1'>Når den første gjengen er ferdig vises de her, fra naa af og ind i evigheden.</Typography>
          )
        ) : (
          [...Array(3).keys()].map((i) => <Skeleton key={i} variant='rectangular' height={50} sx={{ mb: 1, borderRadius: 1 }} animation='wave' />)
        )}
        <Box height={150} />
      </Container>
    </>
  );
};

export default Group;
