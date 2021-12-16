import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Material
import { ThemeProvider } from '@mui/material';

// Views
import About from 'views/About';
import Apply from 'views/Apply';
import Group from 'views/Group';
import Home from 'views/Home';

// Components
import Header from 'components/Header';

// Utils
import ScrollToTop from 'utils/ScrollToTop';

// Constants
import ROUTES from 'constants/routes';

// Themes
import dark from 'themes/dark';

const selectedTheme = dark;

const App: React.FunctionComponent = () => {
  document.body.style.color = selectedTheme.palette.text.primary;
  document.body.style.backgroundColor = selectedTheme.palette.background.default;

  return (
    <ThemeProvider theme={selectedTheme}>
      <Router>
        <ScrollToTop />
        <Header />

        <Switch>
          <Route exact path={ROUTES.HOME}>
            <Home />
          </Route>
          <Route exact path={ROUTES.APPLY}>
            <Apply />
          </Route>
          <Route exact path={ROUTES.ABOUT}>
            <About />
          </Route>
          <Route exact path={ROUTES.GROUP}>
            <Group />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
