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
import Test2 from "../src/pages/FloorCheck/test2";

import SmartMirrorMain from "../src/smartMirror/pages/main";
import SmartMirrorClassRoom from "../src/smartMirror/pages/classRoom";

import { SensorDataProvider } from "../src/API/SensorDataContext";

function App() {
  return (
    <Router>
      <SensorDataProvider>
        <Routes>
          {/* 기본 페이지들 */}
          <Route path="/" element={<Main />} />

          <Route path="/figures" element={<Figures />} />
          <Route path="/figures/:id" element={<Figures />} />

          <Route path="/comparison" element={<Comparison />} />
          <Route path="/comparison/:id" element={<Comparison />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/log" element={<Log />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/alarm" element={<Alarm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/floorcheck/:floor" element={<FloorCheck />} />

          {/* 테스트 페이지 */}
          <Route path="/test" element={<Test />} />
          <Route path="/smartM" element={<SmartMirrorMain />} />
          <Route
            path="/smartMirror/classRoom/:id"
            element={<SmartMirrorClassRoom />}
          />
          <Route path="/test2" element={<Test2 />} />
        </Routes>
      </SensorDataProvider>
    </Router>
  );
}

export default App;
