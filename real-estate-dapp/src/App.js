import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ListProperty from './components/ListProperty';
import BuyProperty from './components/BuyProperty';
import ManageEscrow from './components/ManageEscrow';
//snow oven impulse swim panic alone two enter pig latin mango frost - MNEMONIC
const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">List Property</Link>
            </li>
            <li>
              <Link to="/buy">Buy Property</Link>
            </li>
            <li>
              <Link to="/escrow">Manage Escrow</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/buy">
            <BuyProperty />
          </Route>
          <Route path="/escrow">
            <ManageEscrow />
          </Route>
          <Route path="/">
            <ListProperty />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;