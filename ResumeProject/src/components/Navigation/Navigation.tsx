import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.navBranding}>
          <h1 className={styles.siteTitle}>
            <NavLink to="/" className={styles.navBrand} aria-label="На главную">
              Роман Рахов
            </NavLink>
            <span className={styles.navTagline}>фронтенд-разработчик</span>
          </h1>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? `${styles.navLink} active` : styles.navLink}
            >
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => isActive ? `${styles.navLink} active` : styles.navLink}
            >
              Проекты
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/tasks" 
              className={({ isActive }) => isActive ? `${styles.navLink} active` : styles.navLink}
            >
              Задания
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;