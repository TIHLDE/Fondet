import React, { useEffect, useState } from 'react';
import { Box, Container, Link, Skeleton, Typography } from '@mui/material';
import PageTitle from 'components/PageTitle';

// Api
import Api, { SheetsData } from 'api';

// Components
import ApplicationCard from './components/ApplicationCard';

const Apply: React.FunctionComponent = () => {
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
      <PageTitle>Søk om støtte</PageTitle>
      <Container>
        <Typography variant='h2'>Før du søker</Typography>
        <Typography variant='body1'>
          Det finnes et utall forskjellige støtteordninger som administreres av ulike organisasjoner. Vi ber deg derfor sette deg inn i hvilke andre
          støtteordninger som finnes, og søke der det kan være muligheter før du søker støtte fra TIHLDE-fondet. Oversikten over andre plasser kan finnes {' '}
          <Link href='https://tihlde.org/wiki/sknader/sk-midler-eksternt/' target='_blank'>
            her
          </Link>{' '}
          . Dersom du ikke får støtte andre steder, eller ditt initiativ ikke rimelig kan dekkes av noen andre
          støtteordninger er du velkommen til å søke støtte fra oss.
        </Typography>
        <Typography variant='h2'>Hvordan søke om støtte</Typography>
        <Typography variant='body1' component='div'>
          Kravene en søknad må oppfylle er følgende:
          <ul>
            <li>Kun medlemmer av TIHLDE kan søke om støtte.</li>
            <li>Søknad skal inneholde navn på søker, formålet med søknad, ønsket sum og budsjettering for bruk av midlene.</li>
            <li>Søknad skal være begrunnet og ha som mål å kunne gi en positiv avkastning for TIHLDEs medlemmer.</li>
            <li>
              Minimumsbeløp: 5000 kr. For beløp som er mindre enn dette kan du spørre hs: <Link href='mailto:hs@tihlde.org'>hs@tihlde.org</Link>.
            </li>
            <li>Maksimumsbeløp: 150 000 kr. Beløp som overstiger dette kan ikke behandles internt, og må vedtas av generalforsamlingen.</li>
            <li>Fondet skal kun brukes til investeringer/kjøp som linjeforeningen ikke har budsjettert for.</li>
          </ul>
        </Typography>
        <Typography variant='body1'>
          Vennligst bruk{' '}
          <Link href='https://drive.google.com/uc?id=1PNbg_9fVoJzhjtxQ7G3nD__xZ1uOSoHw&export=download' target='_blank'>
            søknadsmalen
          </Link>{' '}
          når du skriver søknaden. Dersom du ønsker å skrive budsjettet i excel istedenfor rett inn i malen, eller bare legge ved flere dokumenter er det helt
          greit.
        </Typography>
        <br />
        <Typography variant='body1'>
          Søknaden sendes til <Link href='mailto:fondet@tihlde.org'>fondet@tihlde.org</Link>.
        </Typography>
        <Typography variant='h2'>Tidligere søknader</Typography>
        {!loading && sheets ? (
          sheets.previousApplications.length > 0 ? (
            <div>
              {sheets.previousApplications.map((application, i) => (
                <ApplicationCard key={i} application={application} />
              ))}
            </div>
          ) : (
            <Typography variant='body1'>Når noen sender oss en søknad kommer den til slutt her, selv om det kanskje ikke var så mange akkurat nå.</Typography>
          )
        ) : (
          [...Array(4).keys()].map((i) => <Skeleton key={i} variant='rectangular' height={50} sx={{ mb: 1, borderRadius: 1 }} animation='wave' />)
        )}
        <Box height={150} />
      </Container>
    </>
  );
};

export default Apply;
