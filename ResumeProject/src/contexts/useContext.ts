import { createContext, useContext } from "react";

export interface Task {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  status: "Выполнено" | "В процессе" | "Запланировано";
  completionDate?: string;
  demoUrl?: string;
}

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  clearAllTasks: () => void;
}

export const TasksContext = createContext<TasksContextType | undefined>(
  undefined
);

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
