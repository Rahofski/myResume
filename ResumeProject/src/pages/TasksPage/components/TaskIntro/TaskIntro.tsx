import type { ReactNode } from "react";
import styles from "./TaskIntro.module.css";

interface TaskMetaItem {
  label: string;
  value?: ReactNode;
}

interface TaskIntroProps {
  title: string;
  description: ReactNode;
  meta?: TaskMetaItem[];
}

export function TaskIntro({ title, description }: TaskIntroProps) {
  return (
    <header className={styles.wrapper}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.description}>{description}</div>
      </div>
    </header>
  );
}
