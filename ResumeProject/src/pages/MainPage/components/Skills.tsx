import React from 'react';
import styles from '../MainPage.module.css';

interface SkillCategory {
  title: string;
  items: string[];
}

interface SkillsProps {
  skillCategories: SkillCategory[];
  sectionId?: string;
}

const Skills: React.FC<SkillsProps> = ({ skillCategories, sectionId }) => {
  return (
    <section id={sectionId} className="skills">
      <h2 className={styles.sectionTitle}>Мои навыки</h2>
      {skillCategories.map((category, index) => (
        <div key={index} className="skill-category">
          <h3>{category.title}:</h3>
          <ul className={styles.skillsList}>
            {category.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default Skills;