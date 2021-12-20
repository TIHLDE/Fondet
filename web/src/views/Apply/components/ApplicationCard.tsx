import { Check, Close, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Link, Typography } from '@mui/material';
import { Application } from 'api/google-sheets';
import React from 'react';

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => (
  <Accordion variant='outlined'>
    <AccordionSummary expandIcon={<ExpandMore />} sx={{ gap: 2 }}>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          rowGap: { xs: 0, sm: 1 },
          columnGap: 2,
          alignItems: 'center',
          gridTemplateColumns: {
            sm: '1fr auto',
            md: '2fr 3fr auto',
          },
          gridTemplateAreas: {
            xs: `"a"
                 "b"
                 "c"`,
            sm: `"a b"
                 "c c"`,
            md: '"a c b"',
          },
        }}>
        {application.applicant && (
          <Typography variant='h4' sx={{ gridArea: 'a' }}>
            {application.applicant}
          </Typography>
        )}
        {application.purpose && (
          <Typography variant='body1' sx={{ gridArea: 'c' }}>
            {application.purpose}
          </Typography>
        )}
        {application.dateReceived && (
          <Typography variant='body1' sx={{ gridArea: 'b', textAlign: { sm: 'right' } }}>
            {application.dateReceived}
          </Typography>
        )}
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          rowGap: { xs: 1, sm: 2 },
          columnGap: 2,
          alignItems: 'center',
          justifyItems: 'start',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            sm: '1fr 1fr 1fr',
            md: '1fr 1fr 2fr 1fr 1fr  ',
          },
          gridTemplateAreas: {
            xs: `"a a"
                 "b b"
                 "c c"
                 "d e"`,
            sm: `"a b b"
                 "c d e"`,
            md: '"c a b d e"',
          },
        }}>
        {application.applicationUrl && (
          <Link href={application.applicationUrl} target='_blank' sx={{ gridArea: 'a' }}>
            <Typography variant='body1'>Søknad (PDF)</Typography>
          </Link>
        )}
        {application.decisionUrl && (
          <Link href={application.decisionUrl} target='_blank' sx={{ gridArea: 'b' }}>
            <Typography variant='body1'>Beslutningsgrunnlag (PDF)</Typography>
          </Link>
        )}
        {application.approved === 'Innvilget' ? (
          <Chip variant='outlined' color='success' label='Innvilget' icon={<Check />} sx={{ gridArea: 'c' }} />
        ) : (
          <Chip variant='outlined' color='error' label='Avslått' icon={<Close />} sx={{ gridArea: 'c' }} />
        )}
        {application.requestedSum && (
          <Typography variant='body1' sx={{ gridArea: 'd' }}>
            Sum søkt:
            <br />
            {application.requestedSum}
          </Typography>
        )}
        {application.approvedSum && (
          <Typography variant='body1' sx={{ gridArea: 'e' }}>
            Sum innvilget:
            <br />
            {application.approvedSum}
          </Typography>
        )}
      </Box>
    </AccordionDetails>
  </Accordion>
);

export default ApplicationCard;
