import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "../src/pages/Main";
import Figures from "../src/pages/ClassRoom/Figures";
import Login from "../src/pages/Login/Login";
import SignUp from "../src/pages/SignUp/SignUp";
import Comparison from "../src/pages/ClassRoom/Comparison";
import Log from "../src/pages/Log/Log";
import Manager from "../src/pages/Manager/Manager";
import Alarm from "../src/pages/Alarm/Alarm";
import Contact from "../src/pages/Contact/Contact";
import FloorCheck from "../src/pages/FloorCheck/FloorCheck";
import Test from "../src/pages/test";

import SmartMirrorMain from "../src/smartMirror/main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/figures" element={<Figures />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/Log" element={<Log />} />
        <Route path="/Manager" element={<Manager />} />
        <Route path="/Alarm" element={<Alarm />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/floorcheck" element={<FloorCheck />} />

        <Route path="/test" element={<Test />} />
        <Route path="/smartM" element={<SmartMirrorMain />} />
      </Routes>
    </Router>
  );
}

export default App;
