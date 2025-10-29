import { TaskIntro } from "../../components/TaskIntro/TaskIntro";
import styles from "./FlexBox.module.css";

export const FlexBox = () => {
  return (
    <div className={styles.taskPage}>
      <TaskIntro
        title="Задание: Flexbox-ролик. 2025. Без JS."
        description={
          <p>
            Создать компонент анимированного ролика с базовым размером
            200&nbsp;×&nbsp;200&nbsp;px. Изображения прилагаются в архиве.
          </p>
        }
      />

      <div className={styles.taskContent}>
        <div className={styles.container}>
          <section
            className={styles.picture}
            aria-label="Анимация путешествия автомобиля — сцена 1"
          >
            <div className={styles.firstCar}>
              <p>Новое путешествие!</p>
              <div className={styles.bodywork}>
                <img src="/car2.png" alt="Кузов машины" />
              </div>
              <div className={styles.squirell}>
                <img src="/car4.png" alt="Белка" />
              </div>
              <div className={styles.wheels}>
                <img src="/car3.png" alt="Левое колесо" />
                <img src="/car3.png" alt="Правое колесо" />
              </div>
            </div>
            <div className={styles.secondCar}>
              <div className={styles.bodywork2}>
                <img src="/car1.png" alt="Кузов машины" />
                <p>Приехали)</p>
              </div>
              <div className={styles.squirell2}>
                <img src="/car5.png" alt="Белка" />
              </div>
            </div>
          </section>
          <section
            className={styles.picture}
            aria-label="Анимация путешествия автомобиля — сцена 2"
          >
            <div className={styles.firstCar}>
              <p>Новое путешествие!</p>
              <div className={styles.bodywork}>
                <img src="/car2.png" alt="Кузов машины" />
              </div>
              <div className={styles.squirell}>
                <img src="/car4.png" alt="Белка" />
              </div>
              <div className={styles.wheels}>
                <img src="/car3.png" alt="Левое колесо" />
                <img src="/car3.png" alt="Правое колесо" />
              </div>
            </div>
            <div className={styles.secondCar}>
              <div className={styles.bodywork2}>
                <img src="/car1.png" alt="Кузов машины" />
                <p>Приехали)</p>
              </div>
              <div className={styles.squirell2}>
                <img src="/car5.png" alt="Белка" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
