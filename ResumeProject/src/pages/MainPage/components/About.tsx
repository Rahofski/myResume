import React from "react";
import styles from "../MainPage.module.css";

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
            <blockquote>
              <em>
                «Родиться глупым не стыдно, стыдно только умирать глупцом»
              </em>
            </blockquote>
            <cite>— Эрих Мария Ремарк</cite>
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
