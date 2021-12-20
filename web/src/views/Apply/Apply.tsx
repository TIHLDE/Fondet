import React, { useEffect, useState } from 'react';
import { Box, Container, Skeleton, Typography } from '@mui/material';
import PageTitle from 'components/PageTitle';

// Api
import Api, { Application } from 'api/google-sheets';
import ApplicationCard from './components/ApplicationCard';

const Apply: React.FunctionComponent = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Api.getPreviousApplications().then((apps) => {
      setApplications(apps);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageTitle>Søk om støtte</PageTitle>
      <Container>
        <h2>Her kommer det informasjon om søknadsprosessen</h2>
        <ul>
          <li>Hvilke andre støtteordninger som finnes</li>
          <li>Lenke til søknadsmal</li>
          <li>Lenke til e-post addresse til fondet</li>
          <li>Oversikt over tidligere søknader</li>
        </ul>
        <br />
        <br />
        <br />
        <Typography variant='h2'>Tidligere søknader</Typography>
        {!loading ? (
          applications.length > 0 ? (
            <div>
              {applications.map((application, i) => (
                <ApplicationCard key={i} application={application} />
              ))}
            </div>
          ) : (
            <Typography variant='body1'>Når noen sender oss en søknad kommer den til slutt her, selv om det kanskje ikke var så mange akkurat nå.</Typography>
          )
        ) : (
          [...Array(4).keys()].map((i) => <Skeleton key={i} variant='rectangular' height={50} sx={{ mb: 1 }} animation='wave' />)
        )}
        <Box height={150} />
      </Container>
    </>
  );
};

export default Apply;
