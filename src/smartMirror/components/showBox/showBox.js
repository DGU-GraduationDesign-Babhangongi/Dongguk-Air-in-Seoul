import React from 'react';
import styles from './showBox.module.css';  

function showBox({ image, i, unit, name }) {  
  return (
    <div className={styles.container}>
      <img
         src={require("../../../assets/images/smartmirror/showBoxIcon/"+image)}  
         style={{height: '7vw', textAlign:'center'}}  
      />
      <div>
        <div style={{width: '16vw', textAlign:'start'}}>
          <div style={{display:'flex'}}>
            <div style={{fontSize:'5.5vw', fontWeight:'bold'}}>{i}</div> 
            <div style={{fontSize:'2.5vw', alignSelf:'center', paddingLeft:'5%'}}>{unit}</div>  
          </div>
          <div style={{fontSize:'2.5vw' }}>{name}</div>  
        </div>
      </div>
    </div>
  );
}

export default showBox;
