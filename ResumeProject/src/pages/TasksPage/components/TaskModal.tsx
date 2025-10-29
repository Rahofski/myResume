import dialogStyles from "./Dialog.module.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/contexts/useContext";
import type { TaskCardProps } from "./TaskCard";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskCardProps | null;
  mode: "add" | "edit";
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  mode,
}) => {
  const { addTask, updateTask } = useTasks();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const technologiesString = formData.get("technologies") as string;
    const technologies = technologiesString
      ? technologiesString.split(",").map((tech) => tech.trim())
      : [];

    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      technologies,
      status: formData.get("status") as
        | "Выполнено"
        | "В процессе"
        | "Запланировано",
      completionDate:
        formData.get("status") === "Выполнено"
          ? new Date().toLocaleDateString("ru-RU")
          : undefined,
      demoUrl: (formData.get("demoUrl") as string) || undefined,
    };

    if (mode === "add") {
      addTask(taskData);
    } else if (task) {
      updateTask(task.id, taskData);
    }

    onClose();
    e.currentTarget.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${dialogStyles.dialogContent}`}>
        <form onSubmit={handleSubmit}>
          <DialogHeader className={dialogStyles.dialogHeader}>
            <DialogTitle className={dialogStyles.dialogTitle}>
              {mode === "add"
                ? "Добавить новое задание"
                : "Редактировать задание"}
            </DialogTitle>
            <DialogDescription className={dialogStyles.dialogDescription}>
              {mode === "add"
                ? "Заполните информацию о новом учебном задании"
                : "Измените информацию о задании"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className={dialogStyles.formField}>
              <Label htmlFor="title" className={dialogStyles.formLabel}>
                Название задания
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Введите название задания"
                className={dialogStyles.formInput}
                defaultValue={task?.title || ""}
                required
              />
            </div>
            <div className={dialogStyles.formField}>
              <Label htmlFor="description" className={dialogStyles.formLabel}>
                Описание
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Подробное описание задания..."
                className={`${dialogStyles.formTextarea} flex min-h-[80px] w-full rounded-md px-3 py-2 text-sm`}
                defaultValue={task?.description || ""}
                required
              />
            </div>
            <div className={dialogStyles.formField}>
              <Label htmlFor="technologies" className={dialogStyles.formLabel}>
                Технологии
              </Label>
              <Input
                id="technologies"
                name="technologies"
                placeholder="HTML, CSS, JavaScript (через запятую)"
                className={dialogStyles.formInput}
                defaultValue={task?.technologies.join(", ") || ""}
              />
            </div>
            <div className={dialogStyles.formField}>
              <Label htmlFor="status" className={dialogStyles.formLabel}>
                Статус
              </Label>
              <select
                id="status"
                name="status"
                className={`${dialogStyles.formSelect} flex h-10 w-full rounded-md px-3 py-2 text-sm`}
                defaultValue={task?.status || "Запланировано"}
              >
                <option value="Запланировано">Запланировано</option>
                <option value="В процессе">В процессе</option>
                <option value="Выполнено">Выполнено</option>
              </select>
            </div>
            <div className={dialogStyles.formField}>
              <Label htmlFor="demoUrl" className={dialogStyles.formLabel}>
                Ссылка на демо
              </Label>
              <Input
                id="demoUrl"
                name="demoUrl"
                placeholder="Введите ссылку на демо"
                className={dialogStyles.formInput}
                defaultValue={task?.demoUrl || ""}
              />
            </div>
          </div>
          <DialogFooter className={dialogStyles.dialogFooter}>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                className={dialogStyles.cancelButton}
              >
                Отмена
              </Button>
            </DialogClose>
            <Button type="submit" className={dialogStyles.submitButton}>
              {mode === "add"
                ? "Добавить задание"
                : "Сохранить изменения"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};