import React from 'react';
import { AppBar, Box, Button, Link, Toolbar, Typography, useScrollTrigger } from '@mui/material';

// Assets
import logo from 'assets/logo.png';
import { Link as RouterLink } from 'react-router-dom';
import routes from 'constants/routes';

function ElevationScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    style: { transition: 'background-color 0.25s', ...(trigger ? { backgroundColor: 'rgba(0,0,128,0.5)' } : { backgroundColor: 'transparent' }) },
  });
}

const Header: React.FunctionComponent = () => (
  <ElevationScroll>
    <AppBar>
      <Toolbar disableGutters style={{ justifyContent: 'center' }}>
        <Link component={RouterLink} to={routes.HOME} underline='none' color='white' display='inherit' style={{ position: 'absolute', left: 0 }}>
          <img height={40} style={{ marginLeft: 12 }} src={logo} />
          <Typography variant='h4' ml={2} fontWeight='bold'>
            Fondet
          </Typography>
        </Link>
        <Box ml={10}>
          <Button component={RouterLink} to={routes.APPLY}>
            Søk om støtte
          </Button>
          <Button component={RouterLink} to={routes.ABOUT}>
            Om fondet
          </Button>
          <Button component={RouterLink} to={routes.GROUP}>
            Forvaltningsgruppen
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  </ElevationScroll>
);

export default Header;
