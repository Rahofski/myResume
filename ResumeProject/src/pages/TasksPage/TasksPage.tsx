import React from "react";
import { TaskCard } from "./components/TaskCard";
import { Header } from "./components/Header";
import styles from "./TasksPage.module.css";
import { useTasks } from "@/contexts/useContext";

const TasksPage: React.FC = () => {
  const { tasks } = useTasks();

  return (
    <div className={styles.tasksPage}>
      <Header />
      <div className={styles.tasksFlex}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            technologies={task.technologies}
            status={task.status}
            completionDate={task.completionDate}
            demoUrl={task.demoUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
