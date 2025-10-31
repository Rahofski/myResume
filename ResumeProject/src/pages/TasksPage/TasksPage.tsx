import React from "react";
import { Header } from "./components/Header";
import { TaskCard } from "./components/TaskCard";
import styles from "./TasksPage.module.css";
import type { Task } from "@/contexts/useContext";

const TasksPage: React.FC = () => {
  // const { tasks } = useTasks();

  const tasks = [
    {
      id: 1,
      title: "CSS Рисунок",
      description:
        "Создание сложного рисунка с использованием только HTML и CSS",
      technologies: ["HTML5", "CSS3", "Responsive Design"],
      status: "Выполнено",
      completionDate: "18.09.2025",
      demoUrl: "#/tasks/picture-task",
    } as Task,
    {
      id: 2,
      title: "Флексбокс анимация",
      description: "Создание анимации на CSS",
      technologies: ["HTML5", "CSS3", "Flexbox"],
      status: "В процессе",
      completionDate: "05.10.2025",
      demoUrl: "#/tasks/flexbox-task",
    } as Task,
  ];

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
