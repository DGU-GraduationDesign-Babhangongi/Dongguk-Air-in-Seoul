import React from 'react';
import styles from '../../../assets/styles/Contact.module.css';

const ContentBoxHeader = ({ icon, title, content }) => {
  return (
    <div>
      <div className={styles.title}>
        {/* require에 문자열 템플릿 사용 */}
        <img
          src={require(`../../../assets/images/Contact/${icon}`)}
          className={styles.bannerIcon}
          alt="Icon"
        />
        <h2>{title}</h2>
      </div>
      <p>{content}</p>
    </div>
  );
};

export default ContentBoxHeader;
