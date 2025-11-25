import React, { useState, useRef } from "react";
import styles from "./GamePage.module.css";

const GamePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleFullscreen = () => {
    try {
      // Пытаемся получить текущий URL из iframe
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        const currentUrl = iframe.contentWindow.location.href;
        window.open(currentUrl, "_blank");
      } else {
        // Если не получилось, открываем главную страницу игры
        window.open("/myResume/game/index.html", "_blank");
      }
    } catch {
      // В случае ошибки (например, CORS) открываем главную страницу
      window.open("/myResume/game/index.html", "_blank");
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={styles.gamePage}>
      <div className={styles.gameHeader}>
        <h1 className={styles.title}>Курсовая работа</h1>
        <button
          className={styles.fullscreenButton}
          onClick={handleFullscreen}
          aria-label="Открыть в полноэкранном режиме"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          <span>Полноэкранный режим</span>
        </button>
      </div>

      <div className={styles.gameContainer}>
        <div className={styles.iframeWrapper}>
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner}></div>
              <p>Загрузка игры...</p>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src="/myResume/game/index.html"
            title="Игровое приложение - Разрежь фигуру"
            className={styles.gameIframe}
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
