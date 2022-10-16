import { Box, Button, Link, Typography } from '@mui/material';
import Api, { FantasyfundData } from 'api';
import React, { useEffect, useState } from 'react';
import FantasyChart from './FantasyChart';
import FantasyList from './FantasyList';
import FantasyfundLogo from '../../../assets/fantasyfond.svg';

const FantasyWidget: React.FC = () => {
  const [fantasyfundData, setFantasyfundData] = useState<FantasyfundData | null>();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    Api.Fantasyfund.get().then((fantasyfund) => {
      setFantasyfundData(fantasyfund);
    });
  }, []);

  if (fantasyfundData) {
    return (
      <>
        <Box height={64} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '2rem',
            marginBottom: '1rem',
          }}>
          <Link href={`https://investor.dn.no/#!/Fantasyfond/Liga/${fantasyfundData.id}`} target='_blank'>
            <Box component={'img'} src={FantasyfundLogo} sx={{ width: { xs: 170, sm: 200 } }} />
          </Link>
          <Typography variant='h2' sx={{ m: 0 }}>
            {selectedUsers.length > 0 ? 'Sammenlign' : 'Topp 5'}
          </Typography>
        </Box>
        <FantasyChart fantasyfundData={fantasyfundData} selectedUsers={selectedUsers} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.5rem',
            marginBottom: '0.75rem',
          }}>
          <Typography variant='h3' sx={{ m: 0, my: 1 }}>
            Alle deltakere
          </Typography>
          {selectedUsers.length > 0 && (
            <Button color='info' variant='outlined' onClick={() => setTimeout(() => setSelectedUsers([]), 100)}>
              Fjern valgte
            </Button>
          )}
        </Box>
        <FantasyList fantasyfundData={fantasyfundData} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
      </>
    );
  } else {
    return <></>;
  }
};

export default FantasyWidget;
