import React, { useEffect, useState } from 'react';

import { Box, Container, Skeleton, Typography } from '@mui/material';
import PageTitle from 'components/PageTitle';
import Api, { Member } from 'api/google-sheets';
import BigAvatar from './components/BigAvatar';
import PreviousYear from './components/PreviousYear';

const Group: React.FunctionComponent = () => {
  const [currentMembers, setCurrentMembers] = useState<Member[]>([]);
  const [previousMembers, setPreviousMembers] = useState<Map<string, Member[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([Api.getCurrentMembers(), Api.getPreviousMembers()]).then(([cM, pM]) => {
      setCurrentMembers(cM);
      setPreviousMembers(pM);
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
            //gridTemplateColumns: { sx: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gridTemplateColumns: { sx: '1fr', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' },
            gridTemplateAreas: {
              xs: '',
              sm: `"a1 a1 a2 a2"
                   "a3 a3 a4 a4"
                    ". a5 a5 ."`,
              md: `". a1 a1 a2 a2 ."
                  "a3 a3 a4 a4 a5 a5"`,
            },
            mb: 10,
          }}>
          {currentMembers.map((member, i) => (
            <BigAvatar key={i} member={member} sx={{ gridArea: { xs: '', sm: `a${i + 1}` } }} />
          ))}
        </Box>
        <Typography variant='h2'>Tidligere medlemmer</Typography>
        {!loading ? (
          previousMembers.size > 0 ? (
            <div>
              {Array.from(previousMembers).map(([year, members], i) => (
                <PreviousYear key={i} year={year} members={members} />
              ))}
            </div>
          ) : (
            <Typography variant='body1'>Når den første gjengen er ferdig vises de her, fra naa af og ind i evigheden.</Typography>
          )
        ) : (
          <>
            <Skeleton variant='rectangular' height={50} sx={{ mb: 1 }} animation='wave' />
            <Skeleton variant='rectangular' height={50} sx={{ mb: 1 }} animation='wave' />
            <Skeleton variant='rectangular' height={50} sx={{ mb: 1 }} animation='wave' />
          </>
        )}
        <Box height={150} />
      </Container>
    </>
  );
};

export default Group;
