/*Test.js */
import React, { useState, useEffect, useRef } from "react";
import FloorPlans from './components/FloorPlanGroup'

function Test() {
  
 
  return (
    <div>
        <FloorPlans buildingName='테스트' maxFloor='3'/>
    </div>
  );
}

export default Test;
