import { Plus } from "lucide-react";
import { useState } from "react";
import styles from "../TasksPage.module.css";
import { Button } from "@/components/ui/button";
import { TaskModal } from "./TaskModal";

export const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header className={styles.pageHeader}>
      <div>
        <h1>Учебные задания</h1>
        <p>Практические задания с курса "Вёрстка и прототипирование сайтов"</p>
      </div>
      <div className={styles.headerActions}>
        <Button 
          className={styles.addTaskButton}
          onClick={() => setModalOpen(true)}
        >
          <Plus size={18} />
          Добавить задание
        </Button>
      </div>
      
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode="add"
      />
    </header>
  );
};
