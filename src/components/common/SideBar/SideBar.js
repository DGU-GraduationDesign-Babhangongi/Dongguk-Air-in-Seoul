import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './SideBar.module.css'; // 사이드바 스타일을 위한 CSS 모듈

var buildingName= "신공학관";

const SideBar = ({ i }) => {
  return (
    <div className={styles.sidebarContainer} style={{marginTop: '0'}}>
      <aside className={styles.sidebar}>
        <div className={styles.topMenu}>
        <div>현재 건물</div>
        <div className={styles.title}>
          <img
            src={require('../../../assets/images/building.png')}
            alt="building"
            className={styles.titleImg}
          />
          {buildingName}
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
          <li className={classNames(styles.navItem, 
              { [styles.bold]: i === 'main' })}>
              <img
                src={require('../../../assets/images/main.png')}
                alt="main"
                className={styles.icon}
              />
              <Link to="/" className={styles.navLink}>메인화면</Link>
            </li>
            <li className={classNames(styles.navItem, 
              { [styles.bold]: i === 'figures' })}>
              <img
                src={require('../../../assets/images/graph.png')}
                alt="graph"
                className={styles.icon}
              />
              <Link to="/figures" className={styles.navLink}>강의실 수치 확인</Link>
            </li>
            <li className={classNames(styles.navItem, 
              { [styles.bold]: i === '3' })}>
              <img
                src={require('../../../assets/images/layers.png')}
                alt="layers"
                className={styles.icon}
              />
              <Link to="/services" className={styles.navLink}>층별 강의실 수치 확인</Link>
            </li>
            <li className={classNames(styles.navItem, 
              { [styles.bold]: i === '4' })}>
              <img
                src={require('../../../assets/images/compare.png')}
                alt="compare"
                className={styles.icon}
              />
              <Link to="/contact" className={styles.navLink}>강의실 수치비교</Link>
            </li>
            <li className={styles.navItem}>
              <img
                src={require('../../../assets/images/manager.png')}
                alt="manager"
                className={styles.icon}
              />
              <Link to="/contact" className={styles.navLink}>관리실 페이지</Link>
            </li>
          </ul>
        </nav>
        </div>
        <div className={styles.navItem} style={{ justifyContent: 'center'}}>
          <img
                src={require('../../../assets/images/logout.png')}
                alt="main"
                className={styles.logoutIcon}
          />
          <div className={styles.navLink}> 로그아웃</div>
        </div>
      </aside>
      <hr className={styles.separator} />
    </div>
  );
}

export default SideBar;
