import { Link } from "react-router-dom";
import { Connect } from "./Connect/Connect";
import styles from "./Footer.module.css";

const primaryLinks = [
  { label: "Главная", to: "/" },
  { label: "Обо мне", to: "/#about" },
  { label: "Навыки", to: "/#skills" },
  { label: "Проекты", to: "/projects" },
  { label: "Задания", to: "/tasks" },
  { label: "Контакты", to: "/#contacts" },
  { label: "Связаться", to: "/#connect" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <nav className={styles.footerNav} aria-label="Навигация по разделам">
          <h3 className={styles.navTitle}>Навигация</h3>
          <ul className={styles.navList}>
            {primaryLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.connectColumn}>
          <p className={styles.connectIntro}>
            Есть вопросы или идеи? Заполните форму, и я свяжусь с вами.
          </p>
          <Connect sectionId="connect" />
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          © 2025 Rahofski. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
