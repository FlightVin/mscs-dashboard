import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import Societies from './pages/societies/societies';
import HomeRedir from './pages/home/home';
import Trends from './pages/viz/trends';
import NavBar from './pages/header/header';
import Base from './pages/viz/base';
import SectorsInStates from './pages/viz/sec';

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

        <Route path="/viz/sec" element={<>
          <NavBar />
          <SectorsInStates />
        </>
        } />

        <Route path="/viz" element={<>
          <NavBar />
          <Base />
        </>
        } />    
        
        </Routes>
    </>
  );
}

export default App;
