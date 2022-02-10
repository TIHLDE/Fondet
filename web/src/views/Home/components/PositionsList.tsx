import { Accordion, AccordionDetails, AccordionSummary, Box, BoxProps, Link, Typography } from '@mui/material';
import { NordnetData } from 'api';
import React, { useState } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ExpandMore } from '@mui/icons-material';

interface PositionsListProps extends BoxProps {
  nordnetData: NordnetData;
}
enum returnPeriod {
  d1 = 'performanceDay',
  w1 = 'performanceWeek',
  m1 = 'performanceMonth',
  ytd = 'performanceYTD',
}

const PositionsList: React.FC<PositionsListProps> = ({ nordnetData, ...boxProps }) => {
  const [returnP, setReturnP] = useState<returnPeriod>(returnPeriod.ytd);
  const returnPeriods = [
    { name: 'i år', period: returnPeriod.ytd },
    { name: '1 md.', period: returnPeriod.m1 },
    { name: '1 uke', period: returnPeriod.w1 },
    { name: '1 dag', period: returnPeriod.d1 },
  ];
  return (
    <Box {...boxProps}>
      {nordnetData.fundPositions.map((p, i) => (
        <Accordion key={i} variant='outlined'>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography sx={{ fontWeight: 'normal' }}>{p.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1 }}>
              <Typography>
                <strong>Andel</strong>:
              </Typography>
              <Typography sx={{ justifySelf: 'end' }}>{p.percent.toFixed(1)}%</Typography>
              <Typography component='div'>
                <strong>Utvikling</strong>:
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', gap: 1, fontSize: 12, flexWrap: 'wrap' }}>
                  {returnPeriods.map((p, i) => (
                    <Link
                      key={i}
                      sx={{ cursor: 'pointer', textDecoration: 'none', fontWeight: p.period === returnP ? 'bold' : 'light' }}
                      onClick={() => setReturnP(p.period)}>
                      {p.name}
                    </Link>
                  ))}
                </Box>
              </Typography>
              <Typography sx={{ justifySelf: 'end', alignSelf: 'center', color: p[returnP] > 0 ? 'lightgreen' : 'lightcoral' }}>
                {p[returnP] > 0 ? '+' : ''}
                {p[returnP]}%
              </Typography>
              <Typography>
                <strong>Kategori</strong>:
                <br />
                {p.category}
              </Typography>
              <Link sx={{ justifySelf: 'end', alignSelf: 'center' }} href={p.prospectusUrl} target='_blank'>
                <OpenInNewIcon />
              </Link>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
export default PositionsList;
