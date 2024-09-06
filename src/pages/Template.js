import React from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/figures.module.css'
function Figures() {
  return (
    <div>
      <Header />
      
      
      <div style={{display: 'flex'}}>
        <SideBar i='두꺼울 글씨'/>
         <div className={styles.top}> 
          <div>
            
          </div>
        </div >
        <div className={styles.bottom}>

        </div>
      </div >
      
    </div>
  );
}

export default Figures;
