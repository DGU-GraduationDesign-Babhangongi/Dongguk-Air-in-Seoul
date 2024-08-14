import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <div>
      <header className={styles.header}>
        <img
          src={require('../../../assets/images/logo.png')}
          alt="logo"
          className={styles.logo}
        /> 
        <nav className={styles.nav}>
          <Link to="/alarm" className={styles.navLink}>
            <img
              src={require('../../../assets/images/alarm.png')}
              alt="alarm"
              className={styles.icon}
            /> 
            <div className={styles.font}>
              알림
            </div>
          </Link>
          <Link to="/list" className={styles.navLink}>
            <img
              src={require('../../../assets/images/list.png')}
              alt="list"
              className={styles.icon}
            /> 
            <div className={styles.font}>
              강의실 목록
            </div>
          </Link>
          <Link to="/login" className={styles.navLink}>
            <img
              src={require('../../../assets/images/user.png')}
              alt="user"
              className={styles.icon}
            /> 
            <div className={styles.font}>
              로그인
            </div>
          </Link>
        </nav>
      </header>
      <hr className={styles.separator} />
    </div>
  );
}

export default Header;
