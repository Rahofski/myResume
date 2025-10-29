import { TaskIntro } from "../../components/TaskIntro/TaskIntro";
import styles from "./Picture.module.css";

export const Picture = () => {
  return (
    <div className={styles.taskPage}>
      <TaskIntro
        title="Задание: Рисунок CSS. 2025."
        description={
          <p>
            Создать рисунки с помощью стилевой таблицы <code>pic.css</code>.
            Базовый размер 200&nbsp;×&nbsp;200&nbsp;px. Рисунок разместить в
            области Content на странице своего сайта (сайт на данном этапе может
            быть недоделанным). В загрузку необходимо приложить целиком сайт с
            добавленным заданием.
          </p>
        }
      />

      <section className={styles.canvasSection} aria-label="Иллюстрация корабля">
        <div className={styles.picture}>
          <div className={styles.sun}></div>
          <div className={styles.arcs}>
            <div className={styles.arc}></div>
            <div className={styles.arc}></div>
            <div className={styles.arc}></div>
          </div>
          <div className={styles.ship}>
            <div className={styles.black_flag}>
              <div className={styles.cross}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
              </div>
            </div>
            <div className={styles.mast}></div>
            <div className={styles.red_sail}></div>
            <div className={styles.boat}>
              <div className={styles.window}></div>
              <div className={styles.window}></div>
              <div className={styles.window}></div>
              <div className={styles.window}></div>
              <div className={styles.window}></div>
              <div className={styles.window}></div>
            </div>
          </div>
          <div className={styles.sea}>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
          </div>
        </div>
      </section>
    </div>
  );
};
