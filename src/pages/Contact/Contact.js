import React, { useState } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/Contact.module.css'; // Assuming you have this CSS file

function Contact() {
  const [buildingName, setBuildingName] = useState('');
  const [maxFloors, setMaxFloors] = useState('');
  const [drawings, setDrawings] = useState({}); // Storing floor drawings for each floor
  const [selectedRoom, setSelectedRoom] = useState('');
  const [serialNum, setSerialNum] = useState('');
  const [removeBuilding, setRemoveBuilding] = useState('');
  const [removeRoom, setRemoveRoom] = useState('');
  const [removeReason, setRemoveReason] = useState('');

  const handleRegisterBuilding = () => {
    console.log('Building Registered:', buildingName, maxFloors, drawings);
  };

  const handleRegisterRoom = () => {
    console.log('Room Registered:', selectedRoom, serialNum);
  };

  const handleRemoveRoom = () => {
    console.log('Room Removed:', removeBuilding, removeRoom, removeReason);
  };

  const handleDrawingChange = (floor, file) => {
    setDrawings((prevDrawings) => ({
      ...prevDrawings,
      [floor]: file,
    }));
  };

  return (
    <div>
      <Header /> {/* Adding the header */}
      <div style={{ display: 'flex' }}>
        <SideBar /> {/* Adding the sidebar */}
        <div className={styles.container}>
          <div className={styles.registerSection}>
            {/* Register New Building */}
            <div className={styles.registerBuilding}>
              <h2>새 건물 등록</h2>
              <label>Building Name</label>
              <input
                type="text"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
              />
              <label>Max Floors</label>
              <input
                type="text"
                value={maxFloors}
                onChange={(e) => setMaxFloors(e.target.value)}
              />
              <div className={styles.floorDrawings}>
                {[...Array(7)].map((_, index) => (
                  <div key={index}>
                    <label>{index + 1} floor</label>
                    <input
                      type="file"
                      onChange={(e) => handleDrawingChange(index + 1, e.target.files[0])}
                    />
                  </div>
                ))}
              </div>
              <button onClick={handleRegisterBuilding}>Register</button>
            </div>

            {/* Register New Room */}
            <div className={styles.registerRoom}>
              <h2>새 강의실 등록</h2>
              <label>Building</label>
              <select value={buildingName} onChange={(e) => setBuildingName(e.target.value)}>
                <option value="신공학관">신공학관</option>
                {/* Add other building options as needed */}
              </select>
              <label>Room</label>
              <input
                type="text"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              />
              <div className={styles.mapPreview}>
                {/* Replace with actual map image */}
                <img src="/path-to-map.png" alt="Map" />
              </div>
              <label>Serial Num</label>
              <input
                type="text"
                value={serialNum}
                onChange={(e) => setSerialNum(e.target.value)}
              />
              <button onClick={handleRegisterRoom}>Register</button>
            </div>

            {/* Remove Room */}
            <div className={styles.removeRoom}>
              <h2>강의실 삭제</h2>
              <label>Building</label>
              <select value={removeBuilding} onChange={(e) => setRemoveBuilding(e.target.value)}>
                <option value="신공학관">신공학관</option>
                {/* Add other building options as needed */}
              </select>
              <label>Room</label>
              <select value={removeRoom} onChange={(e) => setRemoveRoom(e.target.value)}>
                <option value="3173">3173</option>
                {/* Add other room options as needed */}
              </select>
              <label>Reason</label>
              <input
                type="text"
                value={removeReason}
                onChange={(e) => setRemoveReason(e.target.value)}
              />
              <button onClick={handleRemoveRoom}>Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
