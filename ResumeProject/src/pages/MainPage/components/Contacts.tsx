import React from 'react';
import styles from '../MainPage.module.css';

interface ContactLink {
  text: string;
  url: string;
}

interface ContactsProps {
  contacts: ContactLink[];
  sectionId?: string;
}

const Contacts: React.FC<ContactsProps> = ({ contacts, sectionId }) => {
  return (
    <section id={sectionId} className={styles.contacts}>
      <h2 className={styles.sectionTitle}>Контакты</h2>
      {contacts.map((contact, index) => (
        <p key={index}>
          <a 
            href={contact.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.contactLink}
          >
            {contact.text}
          </a>
        </p>
      ))}
    </section>
  );
};

export default Contacts;