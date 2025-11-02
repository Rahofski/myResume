import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import About from "./components/About";
import Contacts from "./components/Contacts";
import Education from "./components/Education";
import Header from "./components/Header";
import Hobbies from "./components/Hobbies";
import Skills from "./components/Skills";
import ExtendedAbout from "./components/ExtendedAbout";
import styles from "./MainPage.module.css";

// Данные для резюме
const skillsData = [
  {
    title: "Fullstack Development",
    items: [
      "Frontend: HTML5, CSS3, JS, React, Next.js, Zod, Zustand, Redux, Tanstack, Jest, Playwright, i188n, a11y",
      "Backend: Go (Fiber, Gin), MongoDB, PostgreSQL",
      "API: REST",
    ],
  },
  {
    title: "Дополнительно",
    items: ["C++ (ООП, алгоритмы, STL)", "English B2 level"],
  },
];

const educationData = [
  {
    institution:
      "Санкт-Петербургский Политехнический университет Петра Великого",
    period: "(2023г. - наст.вр.)",
  },
  {
    institution: "VK-education, Фронтенд-разработка",
    period: "Осень 2024",
  },
  {
    institution: "Яндекс, Летняя школа разработки интерфейсов(ШРИ)",
    period: "Лето 2025",
  },
];

const hobbiesData = [
  "Футбол",
  "Активные виды отдыха (рыбалка, походы, вело-трипы)",
  "Археология",
  "Панк-Рок!",
];

const contactsData = [
  {
    text: "Telegram",
    url: "https://t.me/Rommachka",
  },
  {
    text: "roma.rakhov15@gmail.com",
    url: "mailto:roma.rakhov15@gmail.com",
  },
  {
    text: "GitHub",
    url: "https://github.com/Rahofski",
  },
];

const MainPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const elementId = location.hash.replace("#", "");
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <Header />
        <About photoSrc="/myResume/me.png" sectionId="about" />
        <Skills skillCategories={skillsData} sectionId="skills" />
        <Education educationItems={educationData} sectionId="education" />
        <Hobbies hobbies={hobbiesData} sectionId="hobbies" />
        <Contacts contacts={contactsData} sectionId="contacts" />
        <ExtendedAbout />
      </div>
    </div>
  );
};

export default MainPage;
