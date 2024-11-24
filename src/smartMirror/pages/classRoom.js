import React, { useContext, useEffect } from 'react';
import styles from './classRoom.module.css'; 
import style from './main.module.css'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ClassRoomButton from '../components/classRoomButton/classRoomButton';  
import ShowBox from '../components/showBox/showBox';  
import Map from '../components/map'; 
import TipsSlide from '../components/tipsSlide/tipsSlide';
import BannerSlide from '../components/BannerSlide/BannerSlide';
import { SensorDataContext } from '../../API/SensorDataContext';

function ClassRoom() {
  // 현재 페이지 URL 경로를 가져오는 훅
  const location = useLocation();
  const navigate = useNavigate();
  const Id = location.pathname.split('/').pop(); // URL에서 강의실 ID 추출

  // SensorDataContext에서 센서 데이터와 관련된 함수 및 상태 가져오기
  const { data: sensorData, setSelectedSensorName, loading, error } = useContext(SensorDataContext);

  // 강의실 ID가 바뀔 때마다 해당 ID에 맞는 센서 이름 설정
  useEffect(() => {
    if (Id) {
      setSelectedSensorName(Id); // 센서 이름 업데이트
    }
  }, [Id, setSelectedSensorName]);

  // 강의실 ID 목록
  const classRoomIds = ['3115', '3173', '4142', '5145', '5147', '6119', '6144'];
  
  // 현재 강의실의 인덱스 찾기
  const currentIndex = classRoomIds.indexOf(Id);
  
  // 이전/다음 강의실 ID 설정
  const previousId = classRoomIds[currentIndex > 0 ? currentIndex - 1 : classRoomIds.length - 1];
  const nextId = classRoomIds[currentIndex < classRoomIds.length - 1 ? currentIndex + 1 : 0];

  // 강의실 ID에 따른 좌표 설정
  const coordinates = {
    '3115': { x: '-2.1', y: '29' },
    '3173': { x: '36.5', y: '22' },
    '4142': { x: '53', y: '72' },
    '5145': { x: '33.5', y: '70' },
    '5147': { x: '14', y: '70' },
    '6119': { x: '62', y: '-7' },
    '6144': { x: '38', y: '75' },
  };

  // 좌표값 추출 (기본값은 x=0, y=0)
  const { x, y } = coordinates[Id] || { x: '0', y: '0' };

  // IAQIndex 값에 따라 공기질 이미지 설정
  const iaqImageSrc = sensorData.IAQIndex?.value >= 86
    ? require("../../assets/images/smartmirror/good.png")
    : sensorData.IAQIndex?.value >= 71
    ? require("../../assets/images/smartmirror/average.png")
    : require("../../assets/images/smartmirror/bad.png");

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={style.header}>
          {/* 홈 버튼 */}
          <div className={styles.topButton}>
            <Link to="/smartM">
              <img
                src={require("../../assets/images/smartmirror/home.png")}
                alt="Home"
                className={styles.img}
              />
            </Link>
          </div>
          
          {/* 로고 이미지 */}
          <img
            src={require("../../assets/images/smartmirror/logo.png")}
            alt="CLEAN AIR iN DONGGUK"
            className={styles.logo}
          />
          
          {/* 뒤로 가기 버튼 */}
          <div className={styles.topButton} onClick={() => navigate(-1)}>
            <img
              src={require("../../assets/images/smartmirror/return.png")}
              alt="Return"
              style={{ width: '60%', margin: 'auto' }}
            />
          </div>
        </div>

        {/* 지도 및 공기질 상태 표시 */}
        <div className={styles.mapContainer}>
          <Map classRoom={Id} x={x} y={y} />
          <div style={{ width: '27%', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '4.6vw' }}>{Id} 강의실</div>
            <div style={{ fontSize: '3vw' }}>동국대학교 신공학관</div>
            <img
              src={iaqImageSrc}  // IAQIndex 값에 따라 이미지 설정
              alt={sensorData.IAQIndex?.value >= 85 ? "good" : sensorData.IAQIndex?.value >= 60 ? "average" : "bad"}
              style={{ width: '76%' }}
            />
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : (
              <div style={{ fontSize: '6vw' }}>{sensorData.IAQIndex?.value || '--'}점</div>
            )}
          </div>
        </div>
      </div>

      {/* 이전/다음 강의실로 이동하는 버튼 및 컴포넌트 */}
      <div className={styles.moveContainer}>
        <div style={{ display: "flex", alignItems: 'center', justifyContent: 'start' }}>
          <img
            src={require("../../assets/images/smartmirror/leftVector.png")}
            alt="Previous"
            style={{ width: '8%', margin: '0 8%' }}
            onClick={() => {
              navigate(`/smartMirror/ClassRoom/${previousId}`);
            }}
          />
          <ClassRoomButton i={previousId} /> 
        </div>
        <div style={{ display: "flex", alignItems: 'center', justifyContent: 'end' }}>
          <ClassRoomButton i={nextId} />
          <img
            src={require("../../assets/images/smartmirror/rightVector.png")}
            alt="Next"
            style={{ width: '8%', margin: '0 8%' }}
            onClick={() => {
              navigate(`/smartMirror/ClassRoom/${nextId}`);
            }}
          />
        </div>
      </div>

      {/* 센서 데이터 및 상세 정보 표시 */}
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

      {/* 팁 및 배너 슬라이드 */}
      <div className={styles.bottomContainer}>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <img
            src={require("../../assets/images/smartmirror/TipsIcon.png")}
            alt="Tips"
            style={{ width: '5vw', paddingRight: '1.5vw' }}
          />
          Tips
        </div>
        <TipsSlide contents={sensorData.AQMScores} />
        <BannerSlide />
      </div>
    </div>
  );
}

export default ClassRoom;
