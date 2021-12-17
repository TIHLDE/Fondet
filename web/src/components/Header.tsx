import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// Material
import { AppBar, Box, Button, Container, IconButton, Link, Toolbar, Typography, useScrollTrigger, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Constants
import ROUTES from 'constants/routes';

// Utils
import useWindowSize from 'utils/useWindowSize';

// Assets
import logo from 'assets/logo.png';

const menu = [
  {
    link: ROUTES.APPLY,
    label: 'Søk om støtte',
  },
  {
    link: ROUTES.ABOUT,
    label: 'Om fondet',
  },
  {
    link: ROUTES.GROUP,
    label: 'Forvaltningsgruppen',
  },
];

function ElevationScroll({ children, override }: { children: React.ReactElement; override?: boolean }) {
  const theme = useTheme();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 4,
  });

  return React.cloneElement(children, {
    style: {
      transition: 'background-color 0.25s',
      ...(trigger || override ? { background: `${theme.palette.background.paper}bf` } : { backgroundColor: 'transparent' }),
    },
  });
}

const Header: React.FunctionComponent = () => {
  const location = useLocation();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // close drawer if width exeeds breakpoint
  const windowSize = useWindowSize();
  if ((windowSize.width ?? 0) >= theme.breakpoints.values.md && drawerOpen) {
    setDrawerOpen(false);
  }

  return (
    <>
      <ElevationScroll override={drawerOpen}>
        <AppBar elevation={0}>
          <Toolbar disableGutters>
            <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Link
                component={RouterLink}
                to={ROUTES.HOME}
                onClick={() => setDrawerOpen(false)}
                underline='none'
                color='white'
                style={{
                  marginLeft: '-8.5px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <img height={30} src={logo} />
                <Typography variant='h4' ml={1} fontWeight='bold'>
                  Fondet
                </Typography>
              </Link>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }} flexDirection='row' justifyContent='center'>
                {menu.map((item, i) => (
                  <Button
                    key={i}
                    component={RouterLink}
                    to={item.link}
                    color='info'
                    style={{
                      textAlign: 'center',
                      ...(location.pathname === item.link
                        ? { fontWeight: 600, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: '2px solid white' }
                        : {}),
                    }}>
                    {item.label}
                  </Button>
                ))}
              </Box>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }} flexDirection='row' justifyContent='end' alignItems='center'>
                <Button variant='outlined' href='https://tihlde.org/' color='info'>
                  tihlde.org
                </Button>
              </Box>
              <Box sx={{ display: { xs: 'flex', md: 'none' } }} flexDirection='row' justifyContent='end'>
                <IconButton size='large' onClick={() => setDrawerOpen(!drawerOpen)} color='info' sx={{ mr: -1.5 }}>
                  <MenuIcon />
                </IconButton>
              </Box>
            </Container>
          </Toolbar>
          <Container>
            <Box
              flexDirection='column'
              sx={{ display: { xs: 'flex', md: 'none' } }}
              alignItems='end'
              style={{ transition: 'height 0.25s', overflow: 'hidden', ...(drawerOpen ? { height: 36.5 * (menu.length + 1) + 12 } : { height: 0 }) }}>
              {menu.map((item, i) => (
                <Button
                  key={i}
                  component={RouterLink}
                  to={item.link}
                  color='info'
                  onClick={() => setDrawerOpen(false)}
                  style={
                    location.pathname === item.link
                      ? { fontWeight: 600, borderBottomRightRadius: 0, borderTopRightRadius: 0, borderRight: '2px solid white' }
                      : {}
                  }>
                  {item.label}
                </Button>
              ))}
              <Button href='https://tihlde.org/' color='info' onClick={() => setDrawerOpen(false)}>
                tihlde.org
              </Button>
            </Box>
          </Container>
        </AppBar>
      </ElevationScroll>
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          display: drawerOpen ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </>
  );
};

export default Header;
