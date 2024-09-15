import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from '../src/pages/Main'; 
import Figures from '../src/pages/ClassRoom/Figures'; 
import Comparison from '../src/pages/ClassRoom/Comparison'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/figures" element={<Figures />} />
        <Route path="/comparison" element={<Comparison />} />
      </Routes>
    </Router>
  );
}

export default App;
