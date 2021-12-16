import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
    elevation: trigger ? 1 : 0,
    style: {
      transition: 'background-color 0.25s',
      ...(trigger || override ? { background: `${theme.palette.background.paper}d9` } : { backgroundColor: 'transparent' }),
    },
  });
}

const Header: React.FunctionComponent = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // close drawer if width exeeds breakpoint
  const windowSize = useWindowSize();
  if ((windowSize.width ?? 0) >= 900 && drawerOpen) {
    setDrawerOpen(false);
  }

  return (
    <ElevationScroll override={drawerOpen}>
      <AppBar>
        <Toolbar disableGutters>
          <Container sx={{ gridTemplateColumns: { xs: 'auto auto', md: '180px 1fr 180px' } }} style={{ display: 'grid' }}>
            <Link
              component={RouterLink}
              to={ROUTES.HOME}
              onClick={() => setDrawerOpen(false)}
              underline='none'
              color='white'
              style={{
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
                <Button key={i} component={RouterLink} to={item.link} sx={{ color: theme.palette.text.primary }}>
                  {item.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }} flexDirection='row' justifyContent='end'>
              <IconButton size='large' onClick={() => setDrawerOpen(!drawerOpen)} color='inherit'>
                <MenuIcon />
              </IconButton>
            </Box>
          </Container>
        </Toolbar>
        <Container>
          <Box
            flexDirection='column'
            sx={{ display: { xs: 'flex', md: 'none' } }}
            alignItems='start'
            style={{ transition: 'height 0.25s', overflow: 'hidden', ...(drawerOpen ? { height: 122 } : { height: 0 }) }}>
            {menu.map((item, i) => (
              <Button
                key={i}
                component={RouterLink}
                to={item.link}
                sx={{ color: theme.palette.text.primary, display: 'block', textAlign: 'right' }}
                onClick={() => setDrawerOpen(false)}
                fullWidth>
                {item.label}
              </Button>
            ))}
          </Box>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
