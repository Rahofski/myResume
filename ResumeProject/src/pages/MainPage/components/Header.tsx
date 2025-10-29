import React from 'react';
import styles from '../MainPage.module.css';

const Header: React.FC = () => {
  return (
    <header id="top" className={styles.header}>
      <h1>Фронтенд-разработчик</h1>
    </header>
  );
};

export default Header;