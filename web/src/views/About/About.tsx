import { Box, Container, Link, Typography } from '@mui/material';
import PageTitle from 'components/PageTitle';
import React from 'react';

const About: React.FunctionComponent = () => (
  <>
    <PageTitle>Om fondet</PageTitle>
    <Container>
      <Typography variant='body1'>
        TIHLDE-fondet er et organ underlagt generalforsamlingen og er dermed sidestilt Hovedstyret. Dette er for at Hovedstyret ikke skal kunne påvirke fondets
        beslutninger. Fondet skal komplementere økonomien til TIHLDE ved å gi muligheten til å gjøre investeringer som ikke er en del av TIHLDEs budsjett.
      </Typography>
      <Typography variant='h2'>Formål</Typography>
      <Typography variant='body1'>
        Formålet til TIHLDE-fondet er å forvalte oppsparte midler på en hensiktsmessig måte og i TIHLDEs beste interesse gjennom å investere i ulike aksjefond.
        Fondet vil også ta innspill fra TIHLDEs medlemmer om forslag til innkjøp som ikke blir budsjettert. Dette kan være alt fra små investeringer som en ny
        kaffetrakter til større investeringer som en egen TIHLDE-kjeller.
      </Typography>
      <Typography variant='h2'>Sammensetning</Typography>
      <Typography variant='body1' component='div'>
        Fondet har totalt 5 medlemmer og består av:
        <ul>
          <li>1 Fondsforvalter</li>
          <li>1 fra De Eldstes Raad</li>
          <li>3 Ordinære medlemmer</li>
        </ul>
      </Typography>
      <Typography variant='h3'>Forvalter</Typography>

      <Typography variant='body1'>
        Fondsforvalter sin hovedoppgave er å organisere og delegere oppgaver til de andre medlemmene i fondet. Forvalter står for kommunikasjon og formidling av
        informasjon ut til hovedstyret og generalformsamlingen.
      </Typography>
      <Typography variant='h3'>Eldste</Typography>

      <Typography variant='body1'>
        Eldste sin oppgave er å delta aktivt for å vedlikeholde verdier og tradisjoner til linjeforeningen, samt å delta aktivt i forvaltningen som fondet gjør.
      </Typography>
      <Typography variant='h3'>Medlemmer</Typography>

      <Typography variant='body1'>
        De resterende medlemmene sin hovedoppgave er å ha fokus på forvaltning og valg av investeringer. Målet er å velge trygge investeringer som
        linjeforeningen kan tjene på langsiktig.
      </Typography>
      <Typography variant='h2'>Strategi og vedtekter</Typography>
      <Typography variant='body1' component='div'>
        <ul>
          <li>
            <Link href='https://drive.google.com/file/d/18FmI2qTCNl2wz19vrlEV3KP3Qrk_J6ri/view?usp=sharing' target='_blank'>
              Fondets vedtekter
            </Link>
          </li>
          <li>
            <Link href='https://drive.google.com/file/d/15zGyLCQvKOjn3aW9p5l1zqTm1Bod0UIK/view?usp=sharing' target='_blank'>
              Fondets overordnede strategi
            </Link>
          </li>
        </ul>
      </Typography>
      <Typography variant='h2'>Årsrapporter</Typography>
      <Typography variant='body1' component='div'>
        <ul>
          <li>
            <Link href='https://drive.google.com/file/d/1elNEV5qC9pKON7UA9W4L1jbINO-Yfshg/view?usp=sharing' target='_blank'>
              Årsrapport 2021
            </Link>
          </li>
          <li>
            <Link href='https://drive.google.com/file/d/1uJ6WKTGz2xjkWRheneRtK0HgF81skZ_Z/view?usp=share_link' target='_blank'>
              Årsrapport 2022
            </Link>
          </li>
          <li>
            <Link href='https://drive.google.com/file/d/1lSWyh7RhnsUhej0nJu9O-ATqqmYNsgOW/view?usp=sharing' target='_blank'>
              Årsrapport 2023
            </Link>
          </li>
        </ul>
      </Typography>
      <Box height={150} />
    </Container>
  </>
);

export default About;
