import styles from "./Logo.module.css";

export function Logo() {
  return (
    <div className={styles.logo}>
      <span className={styles.logo__mark}>RR</span>
      <span className={styles.logo__tagline}>Resume</span>
    </div>
  );
}
