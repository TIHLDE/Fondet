import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow, useTheme } from '@mui/material';
import { FantasyfundData } from 'api';
import React from 'react';

interface FantasyListProps {
  fantasyfundData: FantasyfundData;
}

const FantasyList: React.FC<FantasyListProps> = ({ fantasyfundData }) => {
  const theme = useTheme();
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: theme.palette.background.paper,
        backgroundImage: 'none',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }}>
      <Table size='small'>
        <TableBody>
          {Object.values(fantasyfundData.funds)
            .sort((a, b) => b.values.at(-1).value - a.values.at(-1).value)
            .map((fund, i) => {
              const value = fund.values.at(-1).value;
              return (
                <TableRow key={fund.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.12)' }}>{i + 1}.</TableCell>
                  <TableCell component='th' scope='row' sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.12)' }}>
                    <Link href={`https://investor.dn.no/#!/Fantasyfond/Profil/${fund.profileId}`} target='_blank'>
                      {fund.name}
                    </Link>
                  </TableCell>
                  <TableCell
                    align='right'
                    sx={{ color: value === 100000 ? '#ddd' : value > 100000 ? 'lightgreen' : 'lightcoral', borderBottomColor: 'rgba(255, 255, 255, 0.12)' }}>
                    {numberFormat.format(value)} kr
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const numberFormat = new Intl.NumberFormat('NO', { minimumFractionDigits: 0 });

export default FantasyList;
