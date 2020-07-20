import React from 'react';

import { Switch, Route, Link } from "react-router-dom";

import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';
import RealTimeComp from './RealTimeComp';
import RateChangeComp from './RateChangeComp';
import FooterComp from './FooterComp';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/changerate">
            <RateChangeComp />
          </Route>
          <Route path="/realtime">
            <RealTimeComp />
          </Route>
          <Route path="/historical">
            <Home />
          </Route>
          <Route path="/footer">
            <FooterComp />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
  </Router>
  );
}

export default App;
