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
import Statistics from './pages/viz/stat';
import Areas from './pages/viz/oper';

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

        <Route path="/viz/stat" element={<>
          <NavBar />
          <Statistics />
        </>
        } />

        <Route path="/viz/area" element={<>
          <NavBar />
          <Areas />
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
