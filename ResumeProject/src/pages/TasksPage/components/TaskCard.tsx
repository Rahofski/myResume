import React from "react";
import { ExternalLink } from "lucide-react";
import styles from "./TaskCard.module.css";

export interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  status: "Выполнено" | "В процессе" | "Запланировано";
  completionDate?: string;
  demoUrl?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Выполнено":
      return styles.statusCompleted;
    case "В процессе":
      return styles.statusInProgress;
    case "Запланировано":
      return styles.statusPlanned;
    default:
      return styles.statusPlanned;
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  technologies,
  status,
  completionDate,
  demoUrl,
}) => {
  const cardContent = (
    <div className={styles.taskCard}>
      <div className={styles.taskHeader}>
        <h3 className={styles.taskTitle}>{title}</h3>
        <div className={styles.taskBadges}>
          <span
            aria-label={`Статус задачи: ${status}`}
            className={`${styles.statusBadge} ${getStatusColor(status)}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="task-content">
        <p className={styles.taskDescription}>{description}</p>

        <div className={styles.taskMeta}>
          {completionDate && (
            <div className={styles.completionDate}>
              <strong>Завершено:</strong> {completionDate}
            </div>
          )}
        </div>

        <div className={styles.taskTechnologies}>
          <h4>Технологии:</h4>
          <div className={styles.techTags}>
            {technologies.map((tech, index) => (
              <span key={index} className={styles.techTag}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {demoUrl && (
          <div className={styles.taskLinks}>
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.demoLink}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} style={{ marginRight: "0.5rem" }} />
              Просмотреть демо
            </a>
          </div>
        )}
      </div>
    </div>
  );

  return cardContent;
};
