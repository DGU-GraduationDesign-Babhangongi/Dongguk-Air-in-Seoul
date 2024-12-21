import React, { useState } from 'react';
import FloorPlan from './FloorPlan'; // FloorPlan 컴포넌트 import

const FloorPlans = ({ width = 'clamp(300px, 50vw, 640px)', height, buildingName, maxFloor }) => {
  return (
    <div style={{ width: 'clamp(300px, 50vw, 640px)', position: 'relative', margin: '10px 0', padding: '10px' }}>
      {/* 역순으로 FloorPlan 컴포넌트 렌더링 */}
      {Array.from({ length: maxFloor }, (_, i) => maxFloor - i).map(floor => (
        <div
          key={floor} // 고유 key 값을 부여
          style={{
            marginBottom: floor === 1 ? 0 : '20%', // 1층(마지막 floor)는 아래 margin 제거
            width: 'clamp(300px, 50vw, 640px)', // width를 100%로 설정하여 각 컴포넌트가 전체 영역을 차지하도록 함
          }}
        >
          <FloorPlan
            width={width}
            height={height}
            buildingName={buildingName}
            floor={floor} // 현재 floor 번호 설정
          />
        </div>
      ))}
    </div>
  );
};

export default FloorPlans;
