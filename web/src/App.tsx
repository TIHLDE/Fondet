import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

// Views
import About from 'views/About';
import Apply from 'views/Apply';
import Group from 'views/Group';
import Home from 'views/Home';

// Components
import Header from 'components/Header';

// Constants
import routes from 'constants/routes';
const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Header />
      <div style={{ marginTop: 64 }}>
        <Switch>
          <Route exact path={routes.HOME}>
            <Home />
          </Route>
          <Route exact path={routes.APPLY}>
            <Apply />
          </Route>
          <Route exact path={routes.ABOUT}>
            <About />
          </Route>
          <Route exact path={routes.GROUP}>
            <Group />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
