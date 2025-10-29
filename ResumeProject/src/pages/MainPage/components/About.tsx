import React from 'react';
import styles from '../MainPage.module.css';

interface AboutProps {
  photoSrc: string;
  sectionId?: string;
}

const About: React.FC<AboutProps> = ({ photoSrc, sectionId }) => {
  return (
    <section id={sectionId} className={styles.about}>
      <h2 className={styles.sectionTitle}>Обо мне</h2>
      <div className={styles.profile}>
        <img src={photoSrc} alt="Рахов Роман" className={styles.profilePhoto} />
        <div className={styles.profileInfo}>
          <h3>Рахов Роман</h3>
          <p className={styles.description}>
            <em>"Родиться глупым не стыдно, стыдно только умирать глупцом"</em> — Эрих Мария Ремарк
          </p>
          <p className={styles.description}>
            Я студент СПбПУ, Фронтенд-разработчик с опытом работы с <strong>современными веб-технологиями</strong>. 
            Разрабатываю <strong>frontend и backend</strong>-системы, работаю с базами данных и облачными сервисами. 
            Постоянно совершенствуюсь, изучаю новые технологии и работаю над собственными проектами.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;