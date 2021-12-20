import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import PageTitle from 'components/PageTitle';

// Api
import GoogleSheetsApi, { Application } from 'api/google-sheets';
import ApplicationCard from './components/ApplicationCard';

const Apply: React.FunctionComponent = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    GoogleSheetsApi.getPreviousApplications().then((apps) => setApplications(apps));
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
        {applications.map((application, i) => (
          <ApplicationCard key={i} application={application} />
        ))}
        <br />
        <br />
        <br />
      </Container>
    </>
  );
};

export default Apply;
