import type { ReactNode } from "react";
import React, { useState, useEffect } from "react";
import { TasksContext, type Task } from "./useContext";

const TASKS_STORAGE_KEY = "resue-tasks";

// Хелперы для работы с localStorage
const loadTasksFromStorage = (): Task[] => {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      return JSON.parse(storedTasks);
    }
  } catch (error) {
    console.error("Ошибка при загрузке задач из localStorage:", error);
  }

  return [
    {
      id: 1,
      title: "CSS Рисунок",
      description:
        "Создание сложного рисунка с использованием только HTML и CSS",
      technologies: ["HTML5", "CSS3", "Responsive Design"],
      status: "Выполнено",
      completionDate: "18.09.2025",
      demoUrl: "#/tasks/picture-task",
    },
    {
      id: 2,
      title: "Флексбокс анимация",
      description: "Создание анимации на CSS",
      technologies: ["HTML5", "CSS3", "Flexbox"],
      status: "В процессе",
      completionDate: "05.10.2025",
      demoUrl: "#/tasks/flexbox-task",
    },
  ];
};

const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Ошибка при сохранении задач в localStorage:", error);
  }
};

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Загрузка задач из localStorage при инициализации
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    setTasks(loadedTasks);
    setIsInitialized(true);
  }, []);

  // Сохранение задач в localStorage при каждом изменении (только после инициализации)
  useEffect(() => {
    if (isInitialized) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, isInitialized]);

  const addTask = (newTask: Omit<Task, "id">) => {
    const id = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    setTasks((prev) => [...prev, { ...newTask, id }]);
  };

  const updateTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Дополнительный метод для очистки всех задач
  const clearAllTasks = () => {
    setTasks([]);
    localStorage.removeItem(TASKS_STORAGE_KEY);
  };

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, clearAllTasks }}
    >
      {children}
    </TasksContext.Provider>
  );
};
