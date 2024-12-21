import React, { useState, useEffect } from 'react';
import API from '../../../API/api';
import pin from '../../../assets/images/img_pin.png'; // 핀 이미지 import

const FloorPlan = ({ width, height, buildingName, floor }) => {
  const [loadingDrawing, setLoadingDrawing] = useState(false); // Loading state for image fetch
  const [loadingSensors, setLoadingSensors] = useState(false); // Loading state for sensor data
  const [drawingImage, setDrawingImage] = useState(null);
  const [sensorData, setSensorData] = useState([]); // For sensor data

  useEffect(() => {
    // Automatically trigger searchDrawing and loadSensors when the component is mounted
    searchDrawing();
    loadSensors();
  }, []); // Empty dependency array to run only once on component mount

  const searchDrawing = async () => {
    setLoadingDrawing(true); // Start loading the drawing

    try {
      const response = await fetch(`https://donggukseoul.com/api/buildings/${buildingName}/floors/${floor}/floorPlan`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let result = '';
  
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          result += decoder.decode(value, { stream: true });
        }
  
        console.log(result); // Processed data output in console
        setDrawingImage(result); 
      } else {
        alert('도면 불러오기 실패');
      }
    } catch (error) {
      console.error('Error fetching building data:', error);
      alert('도면 데이터를 불러오는 중 오류가 발생했습니다.'); // Show error message
    } finally {
      setLoadingDrawing(false); // End drawing loading
    }
  };

  const loadSensors = async () => {
    setLoadingSensors(true); // Start loading sensor data

    try {
      const response = await API.get(`/api/buildings/${buildingName}/floors/${floor}/classrooms`, {
        headers: { },
      });
      
      const formattedData = response.data ? response.data.map(item => ({
        id: item.id,
        name: item.name,
        floor: item.floor,
        building: item.building,
        sensorId: item.sensorId,
        sensorType: item.sensorType,
        sensorX: item.sensorX,
        sensorY: item.sensorY + 5,
      })) : [];
      setSensorData(formattedData);
     
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      alert('센서 데이터를 불러오는 중 오류가 발생했습니다.'); // Show error message
    } finally {
      setLoadingSensors(false); // End sensor loading
    }
  };

  // Only render once both loading states are false
  if (loadingDrawing || loadingSensors) {
    return <p>Loading...</p>; // Show loading message while any data is still being fetched
  }

  return (
    <div style={{ position: 'relative', margin: '10px 0', padding: '10px' }}>
      {/* Floor plan image */}
      {drawingImage ? (
        <img
          src={drawingImage}
          alt="도면 이미지"
          style={{
            width: '100%',
            aspectRatio: 3/2,
            objectFit: 'fill',
            position: 'absolute', // Position absolutely within the container
            top: 0,
            left: 0,
            zIndex: 1, // Ensure floor plan image is at the bottom
          }}
        />
      ) : (
        <p>도면을 불러오세요.</p> // Fallback text when there's no image
      )}

      {/* Sensor pins */}
      {sensorData.length > 0 ? (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%',    aspectRatio: 3/2, margin: 0, padding: 0, zIndex: 2 }}>
          {sensorData.map((sensor) => (
            <div style={{ position: 'absolute', left: `${sensor.sensorX}%`, top: `${sensor.sensorY}%` }}>
              <img
                src={pin}
                alt="핀 이미지"
                style={{
                  transform: 'translate(-50%, -100%)',
                  width: '30px',
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>센서 데이터를 불러오세요.</p> // Fallback text when no sensor data is available
      )}
    </div>
  );
};

export default FloorPlan;
