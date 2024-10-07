import React from 'react';
import styles from './classRoom.module.css';  // CSS 파일을 모듈로 import
import ClassRoomButton from '../components/classRoomButton/classRoomButton';  // 대문자로 변경
import ShowBox from '../components/showBox/showBox';  // 대문자로 변경

function ClassRoom() {
  return (
    <div className={styles.container} >
      <div className={styles.topContainer}>
          <div className={styles.header}>
            <div className={styles.topButton}>
              <img
                src={require("../../assets/images/smartmirror/home.png")}
                alt="Home"
                className={styles.img}
              />
            </div>
            <img
              src={require("../../assets/images/smartmirror/logo.png")}
              alt="CLEAN AIR iN DONGGUK"
              className={styles.logo}
            />
            <div className={styles.topButton}>
              <img
                src={require("../../assets/images/smartmirror/return.png")}
                alt="Return"
                style={{ width: '60%', margin: 'auto' }}
              />
            </div>
          </div>
          <div className={styles.mapContainer}>
            <img
                src={require("../../assets/images/smartmirror/3rd_floor.png")}
                alt="Map"
                style={{ width: '27%' }}
             />
             <div style={{ width: '27%', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '4.6vw' }}>6144 강의실</div>
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
            <ClassRoomButton i='6119' /> 
          </div>
          <div style={{display:"flex" ,alignItems:'center', justifyContent:'end'}}>
            <ClassRoomButton i='3115' />  
            <img
                src={require("../../assets/images/smartmirror/rightVector.png")}
                alt="Return"
                style={{ width: '8%', margin: '0 8%' }}
              />
          </div>
      </div>

      <div className={styles.detailContainer}>
        <div style={{display: 'flex',  alignItems: 'end'}}>
          <img
            src={require("../../assets/images/smartmirror/document.png")}
            alt="detail"
            style={{ width: '5vw', paddingRight:'1.5vw'}}
          />
          Detail
        </div>

        <div className={styles.boxContainer}>
          <ShowBox image='temp' i='80' unit='°C' name='temperature'/>
          <ShowBox image='temp' i='43' unit='g/㎥' name='humidity'/>
          <ShowBox image='temp' i='47' unit='㎍/㎥' name='tvoc'/>
          <ShowBox image='temp' i='150' unit='㎛' name='PM2.5'/>
          <ShowBox image='temp' i='43' unit='dB' name='noise'/>
          <ShowBox image='temp' i='ON' unit='' name='sensor'/>
        </div>

      </div>

      <div className={styles.bottomContainer}>
      <div style={{display: 'flex',  alignItems: 'end'}}>
          <img
            src={require("../../assets/images/smartmirror/TipsIcon.png")}
            alt="detail"
            style={{ width: '5vw', paddingRight:'1.5vw'}}
          />
          Tips
        </div>
          <div className={styles.whiteBox} style={{fontSize:'3.3vw'}}> 
            강의실 온도가 높으니 창문을 열어 환기시키거나 <br />에어컨을 작동하는 것은 어떨까요?
          </div>
          <div className={styles.whiteBox}>
            종합설계2 밥한공기 임시운영 중입니다.
           <div style={{display:"flex", width:'100%',
                alignItems: 'center',
                justifyContent: 'space-around',
                marginTop:'2%'
           }}>
           <img
            src={require("../../assets/images/smartmirror/personIcons/person1.png")}
            alt="detail"
            style={{ width: '16vw'}}
            />
           <img
            src={require("../../assets/images/smartmirror/personIcons/person2.png")}
            alt="detail"
            style={{ width: '16vw'}}
            />           
            <img
            src={require("../../assets/images/smartmirror/personIcons/person3.png")}
            alt="detail"
            style={{ width: '16vw'}}
            />           
            <img
            src={require("../../assets/images/smartmirror/personIcons/person4.png")}
            alt="detail"
            style={{ width: '16vw'}}
            />
           </div>
          </div>
          
      </div>

    </div>
  );
}

export default ClassRoom;
