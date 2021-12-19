import React, { useEffect, useState } from 'react';
import { Card, Container, Link, Typography } from '@mui/material';
import PageTitle from 'components/PageTitle';

// Api
import GoogleSheetsApi, { Application } from 'api/google-sheets';

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
        {applications.map((app, i) => (
          <Card
            key={i}
            sx={{
              maxWidth: 600,
              mb: 3,
              p: 2,
              display: 'grid',
              gap: 1,
              gridTemplateAreas: [
                `"applicant applicant date"
                 "purpose purpose purpose"
                 "appurl . decurl"
                 "approved appsum givensum"`,
              ],
            }}>
            {app.applicant && (
              <Typography variant='h4' sx={{ gridArea: 'applicant', alignSelf: 'center' }}>
                {app.applicant}
              </Typography>
            )}
            {app.dateReceived && (
              <Typography variant='body1' sx={{ gridArea: 'date', alignSelf: 'center', justifySelf: 'end' }}>
                {app.dateReceived}
              </Typography>
            )}
            {app.purpose && (
              <Typography variant='body1' sx={{ gridArea: 'purpose', alignSelf: 'start', justifySelf: 'start' }}>
                {app.purpose}
              </Typography>
            )}
            {app.applicationUrl && (
              <Link href={app.applicationUrl} target='_blank' sx={{ gridArea: 'appurl', alignSelf: 'center', justifySelf: 'start' }}>
                <Typography variant='body1'>Søknad</Typography>
              </Link>
            )}
            {app.decisionUrl && (
              <Link href={app.decisionUrl} target='_blank' sx={{ gridArea: 'decurl', alignSelf: 'center', justifySelf: 'start' }}>
                <Typography variant='body1'>Beslutningsgrunnlag</Typography>
              </Link>
            )}
            <Typography variant='body1' sx={{ gridArea: 'approved', alignSelf: 'center', justifySelf: 'start' }}>
              {app.approved}
            </Typography>
            {app.requestedSum && (
              <Typography variant='body1' sx={{ gridArea: 'appsum', alignSelf: 'center', justifySelf: 'center' }}>
                {app.requestedSum}
              </Typography>
            )}
            {app.approvedSum && (
              <Typography variant='body1' sx={{ gridArea: 'givensum', alignSelf: 'center', justifySelf: 'end' }}>
                {app.approvedSum}
              </Typography>
            )}
          </Card>
        ))}
      </Container>
    </>
  );
};

export default Apply;
