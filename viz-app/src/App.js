import React from 'react';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Societies from './pages/societies/societies';
import HomeRedir from './pages/home/home';
import Trends from './pages/viz/trends';
import NavBar from './pages/header/header';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeRedir />}/>
        <Route path="/societies" element={<>
          <NavBar />
          <Societies />
        </>
        } />

        <Route path="/viz/reg" element={<>
          <NavBar />
          <Trends />
        </>
        } />      
        
        </Routes>
    </>
  );
}

export default App;
