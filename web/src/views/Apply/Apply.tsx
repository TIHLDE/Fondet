import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import PageTitle from 'components/PageTitle';

// Api
import Api, { Application } from 'api/google-sheets';
import ApplicationCard from './components/ApplicationCard';

const Apply: React.FunctionComponent = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    Api.getPreviousApplications().then((apps) => setApplications(apps));
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
        {applications.length > 0 && (
          <div>
            {applications.map((application, i) => (
              <ApplicationCard key={i} application={application} />
            ))}
          </div>
        )}
        <Box height={150} />
      </Container>
    </>
  );
};

export default Apply;
