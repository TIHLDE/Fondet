import React, { useEffect, useState } from 'react';

import { Box, Container } from '@mui/material';
import PageTitle from 'components/PageTitle';

const Group: React.FunctionComponent = () => {
  const [currentMembers, setCurrentMembers] = useState([]);
  const [previousMembers, setPreviousMembers] = useState([]);

  useEffect(() => {}, []);

  return (
    <>
      <PageTitle>Forvaltningsgruppen</PageTitle>
      <Container>
        <Box></Box>
      </Container>
    </>
  );
};

export default Group;
