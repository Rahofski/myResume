import React from 'react';
import styles from '../MainPage.module.css';

interface HobbiesProps {
  hobbies: string[];
  sectionId?: string;
}

const Hobbies: React.FC<HobbiesProps> = ({ hobbies, sectionId }) => {
  return (
    <section id={sectionId} className="hobbies">
      <h2 className={styles.sectionTitle}>Мои увлечения</h2>
      <ol className={styles.hobbiesList}>
        {hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ol>
    </section>
  );
};

export default Hobbies;