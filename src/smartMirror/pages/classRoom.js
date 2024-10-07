import React from 'react';
import styles from './classRoom.module.css'; 
import ClassRoomButton from '../components/classRoomButton/classRoomButton';  
import ShowBox from '../components/showBox/showBox';  
import { useLocation, useNavigate } from 'react-router-dom';
import Map from '../components/map'; 
import { Link } from 'react-router-dom';

function ClassRoom() {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 추가
  const Id = location.pathname.split('/').pop();
  
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
          
          <div className={styles.topButton} onClick={() => navigate(-1)}> {/* 클릭 시 이전 페이지로 이동 */}
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
            <div style={{ fontSize: '6vw' }}>GOOD</div>
          </div>
        </div>
      </div>

      <div className={styles.moveContainer}>
        <div style={{display:"flex" ,alignItems:'center', justifyContent:'start'}}>
          <img
              src={require("../../assets/images/smartmirror/leftVector.png")}
              alt="Return"
              style={{ width: '8%', margin: '0 8%' }}
            />
          <ClassRoomButton i={previousId} /> 
        </div>
        <div style={{ display: "flex", alignItems: 'center', justifyContent: 'end' }}>
          {nextId && (
            <ClassRoomButton i={nextId} />
          )}
          <img
            src={require("../../assets/images/smartmirror/rightVector.png")}
            alt="Return"
            style={{ width: '8%', margin: '0 8%' }}
          />
        </div>
      </div>

      <div className={styles.detailContainer}>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <img
            src={require("../../assets/images/smartmirror/document.png")}
            alt="detail"
            style={{ width: '5vw', paddingRight: '1.5vw' }}
          />
          Detail
        </div>

        <div className={styles.boxContainer}>
          <ShowBox image='temp.png' i='80' unit='°C' name='temperature' />
          <ShowBox image='humidity.png' i='43' unit='g/㎥' name='humidity' />
          <ShowBox image='tvoc.png' i='47' unit='㎍/㎥' name='tvoc' />
          <ShowBox image='pm2.5.png' i='150' unit='㎛' name='PM2.5' />
          <ShowBox image='noise.png' i='43' unit='dB' name='noise' />
          <ShowBox image='sensor.png' i='ON' unit='' name='sensor' />
        </div>
      </div>

      <div className={styles.bottomContainer}>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <img
            src={require("../../assets/images/smartmirror/TipsIcon.png")}
            alt="detail"
            style={{ width: '5vw', paddingRight: '1.5vw' }}
          />
          Tips
        </div>
        <div className={styles.whiteBox} style={{ fontSize: '3.3vw' }}>
          강의실 온도가 높으니 창문을 열어 환기시키거나 <br />에어컨을 작동하는 것은 어떨까요?
        </div>
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
              alt="detail"
              style={{ width: '16vw' }}
            />
            <img
              src={require("../../assets/images/smartmirror/personIcons/person2.png")}
              alt="detail"
              style={{ width: '16vw' }}
            />
            <img
              src={require("../../assets/images/smartmirror/personIcons/person3.png")}
              alt="detail"
              style={{ width: '16vw' }}
            />
            <img
              src={require("../../assets/images/smartmirror/personIcons/person4.png")}
              alt="detail"
              style={{ width: '16vw' }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}

export default ClassRoom;
