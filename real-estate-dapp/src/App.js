import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListProperty from './components/ListProperty';
import BuyProperty from './components/BuyProperty';
import ManageEscrow from './components/ManageEscrow';

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

        <Routes>
          <Route path="/buy" element={<BuyProperty />} />
          <Route path="/escrow" element={<ManageEscrow />} />
          <Route path="/" element={<ListProperty />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
