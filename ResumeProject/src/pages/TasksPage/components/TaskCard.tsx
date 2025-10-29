import React, { useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "./TaskCard.module.css";
import { useTasks } from "@/contexts/useContext";
import { TaskModal } from "./TaskModal";

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
  id: taskID,
  title,
  description,
  technologies,
  status,
  completionDate,
  demoUrl,
}) => {
  const { deleteTask, updateTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);

  const currentTask = {
    id: taskID,
    title,
    description,
    technologies,
    status,
    completionDate,
    demoUrl,
  };

  const handleStatusChange = (newStatus: string) => {
    const completionDate = newStatus === "Выполнено" 
      ? new Date().toLocaleDateString('ru-RU') 
      : undefined;
    
    updateTask(taskID, { 
      status: newStatus as "Выполнено" | "В процессе" | "Запланировано",
      completionDate 
    });
  };

  const handleCardClick = () => {
    setModalOpen(true);
  };
  const cardContent = (
    <div className={styles.taskCard} onClick={handleCardClick}>
      <div className={styles.taskHeader}>
        <h3 className={styles.taskTitle}>{title}</h3>
        <div className={styles.taskBadges}>
          <div onClick={(e) => e.stopPropagation()}>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className={`${styles.statusBadge} ${getStatusColor(status)} ${styles.statusSelect}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={styles.selectContent}>
                <SelectItem value="Запланировано">Запланировано</SelectItem>
                <SelectItem value="В процессе">В процессе</SelectItem>
                <SelectItem value="Выполнено">Выполнено</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteTask(taskID);
            }}
            title="Удалить задание"
          >
            <Trash2 size={16} />
          </button>
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
              <ExternalLink size={16} style={{ marginRight: '0.5rem' }} />
              Просмотреть демо
            </a>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {cardContent}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        task={currentTask}
        mode="edit"
      />
    </>
  );
};
