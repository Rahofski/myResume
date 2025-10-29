import React, { useRef } from "react";
import emailjs from "emailjs-com";
import styles from "./Connect.module.css";

interface ConnectProps {
  sectionId?: string;
}

export const Connect: React.FC<ConnectProps> = ({ sectionId }) => {
  const form = useRef<HTMLFormElement | null>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

    console.log("Service ID:", SERVICE_ID);
    console.log("Template ID:", TEMPLATE_ID);
    console.log("Public Key:", PUBLIC_KEY);

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      alert("EmailJS configuration is missing. Please check your .env file.");
      return;
    }

    if (!form.current) return;

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
      () => {
        console.log("SUCCESS!");
        alert("Сообщение отправлено! 👍");
        form.current?.reset();
      },
      (error) => {
        console.log("FAILED...", error);
        alert("Ошибка при отправке. Проверьте конфигурацию EmailJS.");
      }
    );
  };

  return (
    <section id={sectionId} className={styles.connectSection}>
      <h2 className={styles.sectionTitle}>Связаться со мной </h2>
      <form ref={form} onSubmit={sendEmail} className={styles.connectForm}>
        <input
          type="text"
          name="user_name"
          placeholder="Имя"
          required
          className={styles.input}
        />
        <input
          type="email"
          name="user_email"
          placeholder="Email"
          required
          className={styles.input}
        />
        <textarea
          name="message"
          placeholder="Сообщение"
          required
          className={styles.textarea}
        />
        <button type="submit" className={styles.submitButton}>
          Отправить
        </button>
      </form>
    </section>
  );
};
