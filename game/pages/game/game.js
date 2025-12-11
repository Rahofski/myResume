// Основной скрипт игры "Разрежь фигуру"
import gameState from "../../utils/gameState.js";
import {
  getCurrentPlayer,
  saveGameResult,
  getPlayerProgress,
  saveLevelResult,
  getTotalScore,
  isLevelUnlocked,
} from "../../utils/storage.js";
import { SliceGame } from "../../utils/sliceGame.js";
import { getLevelConfig, getMaxLevel } from "../../data.js";

const playerNameElement = document.getElementById("playerName");
const currentLevelElement = document.getElementById("currentLevel");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");

// Области игры
const levelIntroElement = document.getElementById("levelIntro");
const gameContentElement = document.getElementById("gameContent");
const gameAreaElement = document.getElementById("gameArea");

// Кнопки управления
const startLevelBtn = document.getElementById("startLevelBtn");
const pauseBtn = document.getElementById("pauseBtn");
const skipLevelBtn = document.getElementById("skipLevelBtn");
const viewResultsFromGameBtn = document.getElementById(
  "viewResultsFromGameBtn"
);
const exitBtn = document.getElementById("exitBtn");

// Модальные окна
const pauseModal = document.getElementById("pauseModal");
const resumeBtn = document.getElementById("resumeBtn");
const exitFromPauseBtn = document.getElementById("exitFromPauseBtn");

const levelCompleteModal = document.getElementById("levelCompleteModal");
const nextLevelBtn = document.getElementById("nextLevelBtn");

const levelSkippedModal = document.getElementById("levelSkippedModal");
const retryLevelBtn = document.getElementById("retryLevelBtn");
const exitFromSkipBtn = document.getElementById("exitFromSkipBtn");

const gameOverModal = document.getElementById("gameOverModal");
const viewResultsBtn = document.getElementById("viewResultsBtn");

// Canvas элементы
const gameCanvas = document.getElementById("gameCanvas");
const levelInstructionElement = document.getElementById("levelInstruction");

// Переменные
let timerInterval = null;
let isPending = false;
let sliceGame = null;

// Функция для установки размера canvas на весь экран
function resizeCanvas() {
  const headerHeight = 60;
  const levelNavHeight = 52; // Панель уровней
  const footerHeight = 70;
  const hintHeight = 45;
  const padding = 30;

  const availableWidth = window.innerWidth - padding * 2;
  const availableHeight =
    window.innerHeight -
    headerHeight -
    levelNavHeight -
    footerHeight -
    hintHeight -
    padding;

  // Используем максимально возможный размер с пропорциями 4:3
  const aspectRatio = 4 / 3;
  let canvasWidth, canvasHeight;

  if (availableWidth / availableHeight > aspectRatio) {
    // Высота - ограничивающий фактор
    canvasHeight = availableHeight;
    canvasWidth = canvasHeight * aspectRatio;
  } else {
    // Ширина - ограничивающий фактор
    canvasWidth = availableWidth;
    canvasHeight = canvasWidth / aspectRatio;
  }

  // Минимальные размеры
  canvasWidth = Math.max(400, Math.floor(canvasWidth));
  canvasHeight = Math.max(300, Math.floor(canvasHeight));

  gameCanvas.width = canvasWidth;
  gameCanvas.height = canvasHeight;

  // Если игра уже инициализирована, перерисовываем
  if (sliceGame) {
    sliceGame.updateCanvasSize(canvasWidth, canvasHeight);
  }
}

// Вызываем при загрузке и при изменении размера окна
window.addEventListener("resize", () => {
  resizeCanvas();
});

// Инициализация размера
resizeCanvas();

function initGame() {
  const playerName = getCurrentPlayer();

  if (!playerName) {
    alert("Необходимо авторизоваться!");
    window.location.href = "../auth/auth.html";
    return;
  }

  playerNameElement.textContent = playerName;
  gameState.initGame(playerName);

  sliceGame = new SliceGame(gameCanvas);

  // Инициализируем панель уровней
  initLevelNav();

  // Проверяем, есть ли сохранённое состояние для продолжения
  const tempGameState = localStorage.getItem("tempGameState");
  let startLevel = 1;

  if (tempGameState) {
    try {
      const savedState = JSON.parse(tempGameState);
      if (savedState.returnToGame && savedState.currentLevel) {
        startLevel = savedState.currentLevel;
        gameState.currentLevel = startLevel;
        gameState.startLevel(startLevel);
      }
      // Удаляем временное состояние после использования
      localStorage.removeItem("tempGameState");
    } catch (e) {
      console.error("Ошибка чтения сохранённого состояния:", e);
    }
  }

  updateUI();
  showLevelIntro(startLevel);
}

// Обновить интерфейс
function updateUI() {
  const stats = gameState.getStats();

  currentLevelElement.textContent = stats.level;

  if (window.updateScoreDisplay) {
    window.updateScoreDisplay(stats.score);
  }

  // Обновляем таймер
  updateTimerDisplay();

  // Обновляем панель уровней
  updateLevelNav();
}

// Обновление панели навигации по уровням
function updateLevelNav() {
  const playerName = getCurrentPlayer();
  if (!playerName) return;

  const progress = getPlayerProgress(playerName);
  const levelButtons = document.querySelectorAll(".level-nav-btn");
  const totalScoreElement = document.getElementById("totalScore");

  levelButtons.forEach((btn) => {
    const level = parseInt(btn.dataset.level);
    const scoreSpan = btn.querySelector(".level-score");
    const levelScore = progress.levelScores[level] || 0;
    const unlocked = isLevelUnlocked(playerName, level);

    // Обновляем очки или замочек
    if (!unlocked) {
      scoreSpan.textContent = "🔒";
    } else if (levelScore > 0) {
      scoreSpan.textContent = levelScore;
    } else {
      scoreSpan.textContent = "—";
    }

    // Убираем все классы состояния
    btn.classList.remove("active", "completed", "locked");

    // Определяем состояние кнопки
    if (level === gameState.currentLevel) {
      btn.classList.add("active");
    } else if (levelScore > 0) {
      btn.classList.add("completed");
    } else if (!unlocked) {
      btn.classList.add("locked");
    }
  });

  // Обновляем общий счёт
  if (totalScoreElement) {
    totalScoreElement.textContent = getTotalScore(playerName);
  }
}

// Обработчики кнопок уровней
function initLevelNav() {
  const levelButtons = document.querySelectorAll(".level-nav-btn");
  const playerName = getCurrentPlayer();

  levelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = parseInt(btn.dataset.level);

      // Проверяем, разблокирован ли уровень
      if (!isLevelUnlocked(playerName, level)) {
        alert("Этот уровень ещё заблокирован! Пройдите предыдущие уровни.");
        return;
      }

      // Если игра активна, спрашиваем подтверждение
      if (gameState.isGameActive && level !== gameState.currentLevel) {
        if (
          !confirm(
            "Перейти на другой уровень? Текущий прогресс уровня будет потерян."
          )
        ) {
          return;
        }
        stopTimer();
        if (sliceGame) {
          sliceGame.stopMoving();
        }
      }

      // Переходим на выбранный уровень
      gameState.currentLevel = level;
      gameState.resetLevelStats();
      gameState.startLevel(level);
      showLevelIntro(level);
      updateUI();
    });
  });
}

function updateTimerDisplay() {
  const time = gameState.timeRemaining;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (time <= 10) {
    timerElement.style.color = "#ff4444";
  } else if (time <= 20) {
    timerElement.style.color = "#ffaa00";
  } else {
    timerElement.style.color = "#fff";
  }
}

function showLevelIntro(level) {
  levelIntroElement.style.display = "flex";
  gameContentElement.style.display = "none";

  document.getElementById("introLevel").textContent = level;

  const levelConfig = getLevelConfig(level);
  levelInstructionElement.textContent = levelConfig.instruction;
}

function hideLevelIntro() {
  levelIntroElement.style.display = "none";
  gameContentElement.style.display = "block";

  const movingHint = document.getElementById("movingHint");
  if (movingHint) {
    movingHint.style.display = gameState.currentLevel >= 4 ? "inline" : "none";
  }
}

// Начать уровень
function startLevel() {
  hideLevelIntro();
  startTimer();

  loadLevelContent(gameState.currentLevel);
}

function loadLevelContent(level) {
  const levelConfig = getLevelConfig(level);

  sliceGame.initLevel(
    levelConfig.sides,
    levelConfig.targetCuts,
    levelConfig.targetPieces,
    level
  );

  checkGameProgress();
}

function checkGameProgress() {
  const progressCheckInterval = setInterval(() => {
    if (!gameState.isPaused && gameState.isGameActive) {
      const progress = sliceGame.getProgress();

      if (progress.isFailed) {
        clearInterval(progressCheckInterval);
        handleLevelFailed();
        return;
      }

      if (progress.isComplete) {
        clearInterval(progressCheckInterval);
        handleLevelComplete();
      }
    }
  }, 100);

  gameState.progressCheckInterval = progressCheckInterval;
}

function handleLevelFailed() {
  stopTimer();

  if (sliceGame) {
    sliceGame.stopMoving();
  }

  const progress = sliceGame.getProgress();
  const failureReasonElement = document.getElementById("failureReason");

  if (progress.currentCuts > progress.targetCuts) {
    failureReasonElement.textContent = `Слишком много разрезов! Сделано ${progress.currentCuts}, нужно ${progress.targetCuts}`;
  } else if (progress.currentPieces > progress.targetPieces) {
    failureReasonElement.textContent = `Слишком много кусков! Получилось ${progress.currentPieces}, нужно ${progress.targetPieces}`;
  } else if (
    progress.currentCuts === progress.targetCuts &&
    progress.currentPieces < progress.targetPieces
  ) {
    failureReasonElement.textContent = `Недостаточно кусков! Получилось ${progress.currentPieces}, нужно ${progress.targetPieces}`;
  } else {
    failureReasonElement.textContent = "Условия уровня не выполнены!";
  }

  showLevelSkippedModal();
}

function handleLevelComplete() {
  stopTimer();
  gameState.addTimeBonus();
  completeLevel(false);
}

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    if (!gameState.isPaused && gameState.isGameActive) {
      const remaining = gameState.decrementTime();
      updateTimerDisplay();

      if (remaining <= 0) {
        stopTimer();
        handleTimeUp();
      }
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function handleTimeUp() {
  // Останавливаем игру, но не заканчиваем полностью
  if (sliceGame) {
    sliceGame.stopMoving();
  }
  if (gameState.progressCheckInterval) {
    clearInterval(gameState.progressCheckInterval);
  }

  // Показываем модалку с возможностью перепройти уровень
  const failureReasonElement = document.getElementById("failureReason");
  failureReasonElement.textContent = "Время вышло! ⏰";
  showLevelSkippedModal();
}

export function handleCorrectAnswer(timeSpent = 0) {
  if (isPending) return;
  const earned = gameState.addCorrectAnswer(timeSpent);
  isPending = true;

  updateUI();

  showFeedback(`+${earned} очков!`, "success");

  setTimeout(() => {
    nextQuestion();
    isPending = false;
  }, 2000);
}

export function handleWrongAnswer() {
  if (isPending) return;
  isPending = true;
  const penalty = gameState.addWrongAnswer();
  updateUI();

  showFeedback(`${penalty} очков`, "error");

  setTimeout(() => {
    nextQuestion();
    isPending = false;
  }, 2000);
}

function showFeedback(message, type) {
  const feedback = document.createElement("div");
  feedback.className = `feedback feedback-${type}`;
  feedback.textContent = message;
  gameAreaElement.appendChild(feedback);

  setTimeout(() => {
    feedback.remove();
  }, 2000);
}

function completeLevel(isSkipped = false) {
  stopTimer();

  if (isSkipped) {
    showLevelSkippedModal();
    return;
  }

  gameState.addTimeBonus();

  const stats = gameState.getStats();
  const playerName = getCurrentPlayer();

  // Сохраняем очки за уровень (хранится максимум)
  saveLevelResult(playerName, gameState.currentLevel, gameState.levelScore);

  // Сохраняем прогресс после каждого успешно пройденного уровня
  const totalPlayTime = Date.now() - gameState.startTime;
  const currentResult = {
    playerName: playerName,
    score: getTotalScore(playerName), // Используем сумму максимумов за уровни
    level: gameState.currentLevel,
    time: Math.floor(totalPlayTime / 1000),
    correctAnswers: stats.correctAnswers,
    wrongAnswers: stats.wrongAnswers,
    date: new Date().toISOString(),
    isComplete: false,
  };
  saveGameResult(currentResult);

  // Обновляем панель уровней
  updateLevelNav();

  if (gameState.isGameComplete()) {
    completeGame();
  } else {
    showLevelCompleteModal(stats);
  }
}

function showLevelCompleteModal(stats) {
  const progress = sliceGame.getProgress();

  // Показываем очки за этот уровень, а не общую сумму
  document.getElementById("levelScore").textContent = gameState.levelScore;
  document.getElementById("levelCorrect").textContent = progress.currentCuts;
  document.getElementById("levelWrong").textContent = progress.currentPieces;

  levelCompleteModal.style.display = "flex";
}

function showLevelSkippedModal() {
  levelSkippedModal.style.display = "flex";
}

function completeGame() {
  const playerName = getCurrentPlayer();
  const result = gameState.endGame();
  result.isComplete = true;
  result.score = getTotalScore(playerName); // Сумма максимумов за уровни
  saveGameResult(result);

  // Сохраняем состояние для возможности продолжить и улучшить результаты
  const gameStateData = {
    currentLevel: 1, // Начать с первого уровня при продолжении
    returnToGame: true,
    gameComplete: true, // Флаг что игра пройдена
  };
  localStorage.setItem("tempGameState", JSON.stringify(gameStateData));

  // Перенаправляем на страницу рейтинга
  window.location.href = "../results/results.html";
}

function showGameOverModal(title, message) {
  document.getElementById("gameOverTitle").textContent = title;
  document.getElementById("gameOverMessage").textContent = message;
  gameOverModal.style.display = "flex";
}

// Обработчики событий
startLevelBtn.addEventListener("click", () => {
  startLevel();
});

pauseBtn.addEventListener("click", () => {
  gameState.pauseGame();
  pauseModal.style.display = "flex";
});

resumeBtn.addEventListener("click", () => {
  gameState.resumeGame();
  pauseModal.style.display = "none";
});

skipLevelBtn.addEventListener("click", () => {
  if (
    confirm(
      "Завершить игру и перейти к рейтингу?\n\nВы можете вернуться позже и продолжить с текущего прогресса."
    )
  ) {
    stopTimer();
    if (sliceGame) {
      sliceGame.stopMoving();
    }
    // Переходим на рейтинг БЕЗ сохранения состояния для возврата
    localStorage.removeItem("tempGameState");
    window.location.href = "../results/results.html";
  }
});

exitBtn.addEventListener("click", () => {
  if (confirm("Вы уверены, что хотите выйти? Прогресс будет потерян.")) {
    window.location.href = "../auth/auth.html";
  }
});

exitFromPauseBtn.addEventListener("click", () => {
  if (confirm("Выйти из игры? Прогресс будет потерян.")) {
    window.location.href = "../auth/auth.html";
  }
});

nextLevelBtn.addEventListener("click", () => {
  levelCompleteModal.style.display = "none";

  if (gameState.nextLevel()) {
    showLevelIntro(gameState.currentLevel);
    updateUI();
  }
});

retryLevelBtn.addEventListener("click", () => {
  levelSkippedModal.style.display = "none";

  gameState.resetLevelStats();
  gameState.startLevel(gameState.currentLevel);
  showLevelIntro(gameState.currentLevel);
  updateUI();
});

exitFromSkipBtn.addEventListener("click", () => {
  if (confirm("Выйти из игры? Прогресс будет потерян.")) {
    window.location.href = "../auth/auth.html";
  }
});

viewResultsBtn.addEventListener("click", () => {
  window.location.href = "../results/results.html";
});

// Кнопка рейтинга в хедере - сохраняет состояние для возврата
const ratingButton = document.getElementById("ratingButton");
if (ratingButton) {
  ratingButton.addEventListener("click", () => {
    // Ставим игру на паузу
    gameState.pauseGame();
    if (sliceGame) {
      sliceGame.stopMoving();
    }
    stopTimer();

    // Сохраняем состояние для возврата на текущий уровень
    const gameStateData = {
      currentLevel: gameState.currentLevel,
      returnToGame: true,
    };
    localStorage.setItem("tempGameState", JSON.stringify(gameStateData));
    window.location.href = "../results/results.html";
  });
}

// Обработка клавиш клавиатуры
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && gameState.isGameActive && !gameState.isPaused) {
    pauseBtn.click();
  }

  if (e.key === "Enter" && gameState.isPaused) {
    resumeBtn.click();
  }
});

window.addEventListener("beforeunload", (e) => {
  if (gameState.isGameActive) {
    e.preventDefault();
    e.returnValue = "";
  }
});

document.addEventListener("DOMContentLoaded", initGame);

// Панель для преподавателя - быстрый переход между уровнями
const teacherPanelToggle = document.getElementById("teacherPanelToggle");
const teacherPanelContent = document.getElementById("teacherPanelContent");
const teacherLevelBtns = document.querySelectorAll(".teacher-level-btn");

if (teacherPanelToggle) {
  teacherPanelToggle.addEventListener("click", () => {
    teacherPanelContent.classList.toggle("open");
    teacherPanelToggle.querySelector(".toggle-arrow").textContent =
      teacherPanelContent.classList.contains("open") ? "▲" : "▼";
  });
}

teacherLevelBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetLevel = parseInt(btn.dataset.level);

    // Останавливаем текущую игру
    stopTimer();
    if (gameState.progressCheckInterval) {
      clearInterval(gameState.progressCheckInterval);
    }
    if (sliceGame) {
      sliceGame.stopMoving();
    }

    // Закрываем все модальные окна
    pauseModal.style.display = "none";
    levelCompleteModal.style.display = "none";
    levelSkippedModal.style.display = "none";
    gameOverModal.style.display = "none";

    // Сбрасываем время для нового уровня
    const levelConfig = getLevelConfig(targetLevel);
    gameState.timeRemaining = levelConfig.timeLimit;

    // Устанавливаем новый уровень
    gameState.currentLevel = targetLevel;
    gameState.isGameActive = true;
    gameState.isPaused = false;

    // Обновляем UI
    currentLevelElement.textContent = targetLevel;
    updateTimerDisplay();

    // Показываем intro уровня
    levelIntroElement.style.display = "flex";
    gameContentElement.style.display = "none";
    showLevelIntro(targetLevel);

    // Обновляем активную кнопку
    teacherLevelBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
