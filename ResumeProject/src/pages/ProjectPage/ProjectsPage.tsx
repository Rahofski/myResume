import React, { useState } from "react";
import styles from "./ProjectsPage.module.css";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  image?: string[];
}

const ProjectsPage: React.FC = () => {
  const [activeImageIndexes, setActiveImageIndexes] = useState<
    Record<number, number>
  >({});

  const projects: Project[] = [
    {
      id: 1,
      title: "Portfolio Website",
      description:
        "Личный сайт-портфолио, демонстрирующий мои проекты и навыки.",
      technologies: ["React", "TypeScript", "CSS"],
      githubUrl: "https://github.com/Rahofski/portfolio",
      image: ["/myResume/res1.png", "/myResume/res2.png"],
    },
    {
      id: 2,
      title: "Schedule Service",
      description: "Веб-приложение для управления расписанием и задачами.",
      technologies: ["React", "Next.js", "ShadCN", "TypeScript"],
      githubUrl: "https://github.com/Rahofski/schedule",
      image: ["/myResume/schedule1.png", "/myResume/schedule2.png"],
    },
    {
      id: 3,
      title: "Engineering Service",
      description:
        "Сервис для инженеров, включающий инструменты для проектирования и анализа.",
      technologies: ["React", "TypeScript", "CSS"],
      githubUrl: "https://github.com/Rahofski/EngineerSite",
    },
    {
      id: 4,
      title: "React App",
      description: "React-приложение с использованием технологий тестирования",
      technologies: ["React", "TypeScript", "Jest", "React Testing Library"],
      githubUrl: "https://github.com/Rahofski/React_Task_Rakhov",
    },
    {
      id: 5,
      title: "Сервис для промоутеров Яндекс.Поиска",
      description: "Веб-приложение для управления сотрудниками и промоакциями.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Next", "Tanstack"],
      githubUrl: "https://github.com/Rahofski/YandexPromoService",
      image: ["/myResume/yandex1.png", "/myResume/yandex2.png"],
    },
  ];

  return (
    <div className={styles.projectsPage}>
      <header className={styles.pageHeader}>
        <h1>Мои проекты</h1>
        <p>Подборка моих лучших работ в области веб-разработки</p>
      </header>

      <div className={styles.projectsGrid}>
        {projects.map((project) => {
          const images = project.image ?? [];
          const hasImages = images.length > 0;
          const activeIndex = activeImageIndexes[project.id] ?? 0;
          const safeIndex = hasImages
            ? ((activeIndex % images.length) + images.length) % images.length
            : 0;

          const handlePrev = (totalImages: number) => {
            setActiveImageIndexes((prev) => {
              const nextIndex =
                ((prev[project.id] ?? 0) - 1 + totalImages) % totalImages;
              return { ...prev, [project.id]: nextIndex };
            });
          };

          const handleNext = (totalImages: number) => {
            setActiveImageIndexes((prev) => {
              const nextIndex = ((prev[project.id] ?? 0) + 1) % totalImages;
              return { ...prev, [project.id]: nextIndex };
            });
          };

          const handleSelect = (index: number) => {
            setActiveImageIndexes((prev) => ({ ...prev, [project.id]: index }));
          };

          return (
            <div key={project.id} className={styles.projectCard}>
              <div className="project-content">
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>
                  {project.description}
                </p>

                {hasImages && (
                  <div className={styles.carousel}>
                    <div className={styles.carouselImageWrapper}>
                      <img
                        src={images[safeIndex]}
                        alt={`${project.title} screenshot ${safeIndex + 1}`}
                        className={styles.projectImage}
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            className={styles.carouselButton}
                            data-direction="prev"
                            onClick={() => handlePrev(images.length)}
                            aria-label="Предыдущее изображение"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            className={styles.carouselButton}
                            data-direction="next"
                            onClick={() => handleNext(images.length)}
                            aria-label="Следующее изображение"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>
                    {images.length > 1 && (
                      <div className={styles.carouselIndicators}>
                        {images.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`${styles.carouselIndicator} ${index === safeIndex ? styles.activeIndicator : ""}`}
                            onClick={() => handleSelect(index)}
                            aria-label={`Показать изображение ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.projectTechnologies}>
                  <h4>Технологии:</h4>
                  <div className={styles.techTags}>
                    {project.technologies.map((tech, index) => (
                      <span key={index} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.projectLinks}>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.projectLink} ${styles.githubLink}`}
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.projectsFooter}>
        <p>
          Больше проектов доступно на моём{" "}
          <a
            href="https://github.com/Rahofski"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProjectsPage;
