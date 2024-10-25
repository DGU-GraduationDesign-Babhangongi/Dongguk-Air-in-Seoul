import React, { useContext, useEffect, useState } from 'react';
import styles from './classRoom.module.css'; 
import ClassRoomButton from '../components/classRoomButton/classRoomButton';  
import ShowBox from '../components/showBox/showBox';  
import { useLocation, useNavigate } from 'react-router-dom';
import Map from '../components/map'; 
import { Link } from 'react-router-dom';
import { SensorDataContext } from '../../API/SensorDataContext';
import TipsSlide from '../components/tipsSlide/tipsSlide';  // 이름 변경된 컴포넌트 불러오기

function ClassRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const Id = location.pathname.split('/').pop();
  
  // SensorDataContext에서 fetchData 및 setSelectedSensorName 호출
  const { data: sensorData, setSelectedSensorName, loading, error } = useContext(SensorDataContext);
  
  useEffect(() => {
    if (Id) {
      setSelectedSensorName(Id);  // 선택된 센서 이름을 Id로 설정
    }
  }, [Id, setSelectedSensorName]);  // Id 변경 시마다 호출

  const classRoomIds = ['3115', '3173', '4142', '5145', '5147', '6119', '6144'];
  const currentIndex = classRoomIds.indexOf(Id);
  
  const previousId = currentIndex > 0 ? classRoomIds[currentIndex - 1] : classRoomIds[classRoomIds.length - 1];
  const nextId = currentIndex < classRoomIds.length - 1 ? classRoomIds[currentIndex + 1] : classRoomIds[0];

  const coordinates = {
    '3115': { x: '-2.1', y: '29' },
    '3173': { x: '36.5', y: '22' },
    '4142': { x: '53', y: '72' },
    '5145': { x: '33.5', y: '70' },
    '5147': { x: '14', y: '70' },
    '6119': { x: '62', y: '-7' },
    '6144': { x: '38', y: '75' },
  };

  const { x, y } = coordinates[Id] || { x: '0', y: '0' };

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.header}>
          <div className={styles.topButton}>
            <Link to="/smartM">
              <img
                src={require("../../assets/images/smartmirror/home.png")}
                alt="Home"
                className={styles.img}
              />
            </Link>
          </div>
          
          <img
            src={require("../../assets/images/smartmirror/logo.png")}
            alt="CLEAN AIR iN DONGGUK"
            className={styles.logo}
          />
          
          <div className={styles.topButton} onClick={() => navigate(-1)}>
            <img
              src={require("../../assets/images/smartmirror/return.png")}
              alt="Return"
              style={{ width: '60%', margin: 'auto' }}
            />
          </div>
        </div>
        <div className={styles.mapContainer}>
          <Map classRoom={Id} x={x} y={y} />
          <div style={{ width: '27%', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '4.6vw' }}>{Id} 강의실</div>
            <div>동국대학교 신공학관</div>
            <img
              src={require("../../assets/images/smartmirror/good.png")}
              alt="good"
              style={{ width: '76%' }}
            />
            {loading ? (
              <div>Loading...</div> // 로딩 중 메시지
            ) : error ? (
              <div>Error: {error}</div> // 에러 메시지
            ) : (
              <div style={{ fontSize: '6vw' }}>{sensorData.IAQIndex?.value || '--'}점</div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.moveContainer}>
        <div style={{ display: "flex", alignItems: 'center', justifyContent: 'start' }}>
          <img
            src={require("../../assets/images/smartmirror/leftVector.png")}
            alt="Previous"
            style={{ width: '8%', margin: '0 8%' }}
          />
          <ClassRoomButton i={previousId} /> 
        </div>
        <div style={{ display: "flex", alignItems: 'center', justifyContent: 'end' }}>
          <ClassRoomButton i={nextId} />
          <img
            src={require("../../assets/images/smartmirror/rightVector.png")}
            alt="Next"
            style={{ width: '8%', margin: '0 8%' }}
          />
        </div>
      </div>

      <div className={styles.detailContainer}>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <img
            src={require("../../assets/images/smartmirror/document.png")}
            alt="Detail"
            style={{ width: '5vw', paddingRight: '1.5vw' }}
          />
          Detail
        </div>

        <div className={styles.boxContainer}>
        <ShowBox image='temp.png' i={loading ? '--' : sensorData.Temperature?.value} unit='°C' name='Temperature' />
        <ShowBox image='humidity.png' i={loading ? '--' : sensorData.Humidity?.value} unit='%' name='Humidity' />
        <ShowBox image='tvoc.png' i={loading ? '--' : sensorData.TVOC?.value} unit='㎍/㎥' name='TVOC' />
        <ShowBox image='pm2.5.png' i={loading ? '--' : sensorData.PM2_5MassConcentration?.value} unit='㎛' name='PM2.5' />
        <ShowBox image='noise.png' i={loading ? '--' : sensorData.AmbientNoise?.value} unit='dB' name='Noise' />
        <ShowBox image='sensor.png' i={loading ? '--' : 'ON'} unit='' name='Sensor' />
        </div>
      </div>

      <div className={styles.bottomContainer}>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <img
            src={require("../../assets/images/smartmirror/TipsIcon.png")}
            alt="Tips"
            style={{ width: '5vw', paddingRight: '1.5vw' }}
          />
          Tips
        </div>
        <TipsSlide contents={sensorData.AQMScores}/>
        <div className={styles.whiteBox}>
          종합설계2 밥한공기 임시운영 중입니다.
          <div style={{
            display: "flex", width: '100%',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: '2%'
          }}>
            <img
              src={require("../../assets/images/smartmirror/personIcons/person1.png")}
              alt="person1"
              style={{ width: '16vw' }}
            />
            <img
              src={require("../../assets/images/smartmirror/personIcons/person2.png")}
              alt="person2"
              style={{ width: '16vw' }}
            />
            <img
              src={require("../../assets/images/smartmirror/personIcons/person3.png")}
              alt="person3"
              style={{ width: '16vw' }}
            />
            <img
              src={require("../../assets/images/smartmirror/personIcons/person4.png")}
              alt="person4"
              style={{ width: '16vw' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassRoom;
