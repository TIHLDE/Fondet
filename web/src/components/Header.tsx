import React, { useState } from 'react';
import { AppBar, Box, Button, IconButton, Link, Toolbar, Typography, useScrollTrigger } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Utils
import useWindowSize from 'utils/useWindowSize';

// Assets
import logo from 'assets/logo.png';
import { Link as RouterLink } from 'react-router-dom';
import routes from 'constants/routes';

const menu = [
  {
    link: routes.APPLY,
    label: 'Søk om støtte',
  },
  {
    link: routes.ABOUT,
    label: 'Om fondet',
  },
  {
    link: routes.GROUP,
    label: 'Forvaltningsgruppen',
  },
];

function ElevationScroll({ children, override }: { children: React.ReactElement; override?: boolean }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    style: { transition: 'background-color 0.25s', ...(trigger || override ? { backgroundColor: 'rgba(0,0,128,0.5)' } : { backgroundColor: 'transparent' }) },
  });
}

const Header: React.FunctionComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // close drawer if width exeeds breakpoint
  const windowSize = useWindowSize();
  if ((windowSize.width ?? 0) >= 900 && drawerOpen) {
    setDrawerOpen(false);
  }

  return (
    <ElevationScroll override={drawerOpen}>
      <AppBar>
        <Toolbar disableGutters style={{ justifyContent: 'center' }}>
          <Link
            component={RouterLink}
            to={routes.HOME}
            onClick={() => setDrawerOpen(false)}
            underline='none'
            color='white'
            display='inherit'
            style={{ position: 'absolute', left: 0 }}>
            <img height={40} style={{ marginLeft: 12 }} src={logo} />
            <Typography variant='h4' ml={2} fontWeight='bold'>
              Fondet
            </Typography>
          </Link>
          <Box ml={10} sx={{ display: { xs: 'none', md: 'inherit' } }}>
            {menu.map((item, i) => (
              <Button key={i} component={RouterLink} to={item.link}>
                {item.label}
              </Button>
            ))}
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
          {menu.map((item, i) => (
            <Button key={i} component={RouterLink} to={item.link} onClick={() => setDrawerOpen(false)} fullWidth>
              {item.label}
            </Button>
          ))}
        </Box>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
