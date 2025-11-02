import React from "react";
import styles from "../MainPage.module.css";

const Header: React.FC = () => {
  return (
    <header id="top" className={styles.header}>
      <h1>Фронтенд-разработчик</h1>
      <button className={styles.downloadButton}>
        <a href="/myResume/Резюме_РаховРИ_Фронтенд.pdf" download>
          Скачать резюме
        </a>
      </button>
    </header>
  );
};

export default Header;
