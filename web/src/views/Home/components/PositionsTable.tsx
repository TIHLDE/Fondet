import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { NordnetData } from 'api';
import React, { useState } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ExpandMore } from '@mui/icons-material';
interface PositionsTableProps {
  nordnetData: NordnetData;
}
enum returnPeriod {
  d1 = 'performanceDay',
  w1 = 'performanceWeek',
  m1 = 'performanceMonth',
  ytd = 'performanceYTD',
}

const PositionsTable: React.FC<PositionsTableProps> = ({ nordnetData }) => {
  const [returnP, setReturnP] = useState<returnPeriod>(returnPeriod.ytd);
  const returnPeriods = [
    { name: 'i år', period: returnPeriod.ytd },
    { name: '1 md.', period: returnPeriod.m1 },
    { name: '1 uke', period: returnPeriod.w1 },
    //{ name: '1 dag', period: returnPeriod.d1 },
  ];
  return (
    <>
      <Table sx={{ mt: 8, display: { xs: 'none', md: 'table' } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ pb: 3 }}>Fond</TableCell>
            <TableCell sx={{ pb: 3 }}>Andel</TableCell>
            <TableCell>
              Utvikling
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', gap: 1, fontSize: 12, flexWrap: 'wrap', mb: -2 }}>
                {returnPeriods.map((p, i) => (
                  <Link
                    key={i}
                    sx={{ cursor: 'pointer', textDecoration: 'none', fontWeight: p.period === returnP ? 'bold' : 'light' }}
                    onClick={() => setReturnP(p.period)}>
                    {p.name}
                  </Link>
                ))}
              </Box>
            </TableCell>
            <TableCell sx={{ pb: 3 }}>Kategori</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nordnetData.fundPositions.map((p, i) => (
            <TableRow key={i}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.percent.toFixed(1)}%</TableCell>
              <TableCell sx={{ color: p[returnP] > 0 ? 'lightgreen' : 'lightcoral' }}>
                {p[returnP] > 0 ? '+' : ''}
                {p[returnP]}%
              </TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>
                <Link href={p.prospectusUrl} target='_blank'>
                  <OpenInNewIcon />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ mt: 3, display: { xs: 'block', md: 'none' } }}>
        {nordnetData.fundPositions.map((p, i) => (
          <Accordion key={i} variant='outlined'>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography sx={{ fontWeight: 'bold' }}>{p.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Andel</Typography>
                <Typography sx={{ justifySelf: 'end' }}>{p.percent.toFixed(1)}%</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>
                  Utvikling
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
                  Kategori:
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
    </>
  );
};
export default PositionsTable;
