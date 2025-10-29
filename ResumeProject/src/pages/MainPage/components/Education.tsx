import React from 'react';
import styles from '../MainPage.module.css';

interface EducationItem {
  institution: string;
  period: string;
}

interface EducationProps {
  educationItems: EducationItem[];
  sectionId?: string;
}

const Education: React.FC<EducationProps> = ({ educationItems, sectionId }) => {
  return (
    <section id={sectionId} className="education">
      <h2 className={styles.sectionTitle}>Образование</h2>
      <ol className={styles.educationList}>
        {educationItems.map((item, index) => (
          <li key={index}>
            {item.institution}<br />
            {item.period}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Education;