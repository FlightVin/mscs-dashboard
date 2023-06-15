import React from 'react';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Societies from './pages/societies/societies';
import HomeRedir from './pages/home/home';

function App() {
  const RedirectPage = () => {
    React.useEffect(() => {
      window.location.replace('https://www.google.com')
    }, [])
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeRedir />}/>
        <Route path="/societies" element={<Societies />} />
      </Routes>
    </>
  );
}

export default App;
