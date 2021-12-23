import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { Member } from 'api';
import React from 'react';

interface PreviousYearProps {
  year: string;
  members: Member[];
}

const PreviousYear: React.FC<PreviousYearProps> = ({ year, members }) => (
  <Accordion variant='outlined'>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Typography variant='h4'>{year}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <List>
        {members.map((member, i) => (
          <ListItem key={i}>
            <ListItemAvatar>
              <Avatar alt={member.name} src={member.imageUrl} />
            </ListItemAvatar>
            <ListItemText primary={member.name} secondary={member.title} />
          </ListItem>
        ))}
      </List>
    </AccordionDetails>
  </Accordion>
);

export default PreviousYear;
