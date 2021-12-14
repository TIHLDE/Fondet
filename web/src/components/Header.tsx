import React, { useState } from 'react';
import { AppBar, Box, Button, IconButton, Link, Menu, MenuItem, Toolbar, Typography, useScrollTrigger } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

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

const Header: React.FunctionComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ElevationScroll>
      <AppBar>
        <Toolbar disableGutters style={{ justifyContent: 'center' }}>
          <Link component={RouterLink} to={routes.HOME} underline='none' color='white' display='inherit' style={{ position: 'absolute', left: 0 }}>
            <img height={40} style={{ marginLeft: 12 }} src={logo} />
            <Typography variant='h4' ml={2} fontWeight='bold'>
              Fondet
            </Typography>
          </Link>
          <Box ml={10} sx={{ display: { xs: 'none', md: 'inherit' } }}>
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
          <Box pr={1} sx={{ display: { xs: 'flex', md: 'none' } }} style={{ position: 'absolute', right: 0 }}>
            <IconButton size='large' onClick={() => setDrawerOpen(!drawerOpen)} color='inherit'>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
        <Box
          flexDirection='column'
          sx={{ display: { xs: 'flex', md: 'none' } }}
          alignItems='start'
          style={{ transition: 'height 0.25s', overflow: 'hidden', ...(drawerOpen ? { height: '100vh' } : { height: 0 }) }}>
          <Button component={RouterLink} to={routes.APPLY} fullWidth>
            Søk om støtte
          </Button>
          <Button component={RouterLink} to={routes.ABOUT} fullWidth>
            Om fondet
          </Button>
          <Button component={RouterLink} to={routes.GROUP} fullWidth>
            Forvaltningsgruppen
          </Button>
        </Box>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
