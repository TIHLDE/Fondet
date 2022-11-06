import { Checkbox, Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow, useMediaQuery, useTheme } from '@mui/material';
import { FantasyfundData } from 'api';
import React from 'react';

interface FantasyListProps {
  fantasyfundData: FantasyfundData;
  selectedUsers: number[];
  setSelectedUsers: (users: number[]) => void;
}

const FantasyList: React.FC<FantasyListProps> = ({ fantasyfundData, selectedUsers, setSelectedUsers }) => {
  const theme = useTheme();
  const greaterThanSm = useMediaQuery(theme.breakpoints.up('sm'));
  const xMax = Math.max(...Object.values(fantasyfundData.funds).map((f) => f.values.at(-1).timestamp.seconds));

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
            .filter(({ values }) => values.find((v) => v.timestamp.seconds === xMax) !== undefined) // Remove elements without current x value
            .sort((a, b) => b.values.at(-1).value - a.values.at(-1).value)
            .map((fund, i, { length }) => {
              const value = fund.values.at(-1).value;
              return (
                <React.Fragment key={fund.name}>
                  <TableRow
                    sx={{
                      borderBottom: { sm: i < length - 1 ? '1px solid rgba(255, 255, 255, 0.12)' : 'none', xs: 'none' },
                    }}>
                    <TableCell sx={{ border: 0, pr: 0 }} rowSpan={!greaterThanSm ? 2 : undefined}>
                      {i + 1}.
                    </TableCell>
                    <TableCell sx={{ border: 0, p: 0 }} rowSpan={!greaterThanSm ? 2 : undefined}>
                      <Checkbox
                        size='small'
                        color='info'
                        disabled={!selectedUsers.includes(fund.profileId) && selectedUsers.length >= 10}
                        checked={selectedUsers.includes(fund.profileId)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setTimeout(() => {
                            if (checked) {
                              setSelectedUsers([...selectedUsers, fund.profileId]);
                            } else {
                              setSelectedUsers(selectedUsers.filter((u) => u !== fund.profileId));
                            }
                          }, 100);
                        }}
                      />
                    </TableCell>
                    <TableCell component='th' scope='row' sx={{ border: 0 }}>
                      <Link href={`https://investor.dn.no/#!/Fantasyfond/Profil/${fund.profileId}`} target='_blank'>
                        {fund.name}
                      </Link>
                    </TableCell>
                    <TableCell
                      align='right'
                      sx={{
                        display: { xs: 'none', sm: 'table-cell' },
                        color: value === 100000 ? '#ddd' : value > 100000 ? 'lightgreen' : 'lightcoral',
                        border: 0,
                      }}>
                      {numberFormat.format(value)} kr
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ display: { xs: 'table-row', sm: 'none' }, borderBottom: i < length - 1 ? '1px solid rgba(255, 255, 255, 0.12)' : 'none' }}>
                    <TableCell
                      align='left'
                      sx={{
                        color: value === 100000 ? '#ddd' : value > 100000 ? 'lightgreen' : 'lightcoral',
                        border: 0,
                      }}>
                      {numberFormat.format(value)} kr
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const numberFormat = new Intl.NumberFormat('NO', { minimumFractionDigits: 0 });

export default FantasyList;
