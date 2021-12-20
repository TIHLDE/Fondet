import { Check, Close } from '@mui/icons-material';
import { Card, Chip, Link, Typography } from '@mui/material';
import { Application } from 'api/google-sheets';
import React from 'react';

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }: ApplicationCardProps) => (
  <Card
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
    {application.applicant && (
      <Typography variant='h4' sx={{ gridArea: 'applicant', alignSelf: 'center' }}>
        {application.applicant}
      </Typography>
    )}
    {application.dateReceived && (
      <Typography variant='body1' sx={{ gridArea: 'date', alignSelf: 'center', justifySelf: 'end' }}>
        {application.dateReceived}
      </Typography>
    )}
    {application.purpose && (
      <Typography variant='body1' sx={{ gridArea: 'purpose', alignSelf: 'start', justifySelf: 'start' }}>
        {application.purpose}
      </Typography>
    )}
    {application.applicationUrl && (
      <Link href={application.applicationUrl} target='_blank' sx={{ gridArea: 'appurl', alignSelf: 'center', justifySelf: 'start' }}>
        <Typography variant='body1'>Søknad</Typography>
      </Link>
    )}
    {application.decisionUrl && (
      <Link href={application.decisionUrl} target='_blank' sx={{ gridArea: 'decurl', alignSelf: 'center', justifySelf: 'start' }}>
        <Typography variant='body1'>Beslutningsgrunnlag</Typography>
      </Link>
    )}
    {application.approved === 'Innvilget' ? (
      <Chip variant='outlined' color='success' label='Innvilget' icon={<Check />} sx={{ gridArea: 'approved', alignSelf: 'center', justifySelf: 'start' }} />
    ) : (
      <Chip variant='outlined' color='error' label='Avslått' icon={<Close />} sx={{ gridArea: 'approved', alignSelf: 'center', justifySelf: 'start' }} />
    )}
    {application.requestedSum && (
      <Typography variant='body1' sx={{ gridArea: 'appsum', alignSelf: 'center', justifySelf: 'center' }}>
        {application.requestedSum}
      </Typography>
    )}
    {application.approvedSum && (
      <Typography variant='body1' sx={{ gridArea: 'givensum', alignSelf: 'center', justifySelf: 'end' }}>
        {application.approvedSum}
      </Typography>
    )}
  </Card>
);

export default ApplicationCard;
