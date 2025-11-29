// Основной скрипт игры "Разрежь фигуру"
import gameState from "../../utils/gameState.js";
import { getCurrentPlayer, saveGameResult } from "../../utils/storage.js";
import { SliceGame } from "../../utils/sliceGame.js";
import { getLevelConfig, getMaxLevel } from "../../data.js";

// DOM элементы
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
const viewResultsFromGameBtn = document.getElementById("viewResultsFromGameBtn");
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

// Инициализация игры
function initGame() {
  const playerName = getCurrentPlayer();

  if (!playerName) {
    alert("Необходимо авторизоваться!");
    window.location.href = "../auth/auth.html";
    return;
  }

  playerNameElement.textContent = playerName;
  gameState.initGame(playerName);
  
  // Инициализируем Canvas игру
  sliceGame = new SliceGame(gameCanvas);

  updateUI();
  showLevelIntro(1);
}

// Обновить интерфейс
function updateUI() {
  const stats = gameState.getStats();

  currentLevelElement.textContent = stats.level;

  // Обновляем счет через глобальную функцию
  if (window.updateScoreDisplay) {
    window.updateScoreDisplay(stats.score);
  }

  // Обновляем таймер
  updateTimerDisplay();
}

// Обновить отображение таймера
function updateTimerDisplay() {
  const time = gameState.timeRemaining;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Меняем цвет при малом количестве времени
  if (time <= 10) {
    timerElement.style.color = "#ff4444";
  } else if (time <= 20) {
    timerElement.style.color = "#ffaa00";
  } else {
    timerElement.style.color = "#333";
  }
}

// Показать intro уровня
function showLevelIntro(level) {
  levelIntroElement.style.display = "flex";
  gameContentElement.style.display = "none";

  document.getElementById("introLevel").textContent = level;

  // Показываем инструкцию для текущего уровня
  const levelConfig = getLevelConfig(level);
  levelInstructionElement.textContent = levelConfig.instruction;
}

// Скрыть intro и показать игровой контент
function hideLevelIntro() {
  levelIntroElement.style.display = "none";
  gameContentElement.style.display = "block";
}

// Начать уровень
function startLevel() {
  hideLevelIntro();
  startTimer();

  loadLevelContent(gameState.currentLevel);
}

// Загрузка контента уровня
function loadLevelContent(level) {
  const levelConfig = getLevelConfig(level);

  // Инициализируем Canvas игру с параметрами уровня
  sliceGame.initLevel(
    levelConfig.sides,
    levelConfig.targetCuts,
    levelConfig.targetPieces
  );

  // Запускаем проверку прогресса
  checkGameProgress();
}

// Проверка прогресса игры
function checkGameProgress() {
  const progressCheckInterval = setInterval(() => {
    if (!gameState.isPaused && gameState.isGameActive) {
      const progress = sliceGame.getProgress();

      // Проверяем провал уровня (слишком много кусков)
      if (progress.isFailed) {
        clearInterval(progressCheckInterval);
        handleLevelFailed();
        return;
      }

      // Проверяем завершение уровня
      if (progress.isComplete) {
        clearInterval(progressCheckInterval);
        handleLevelComplete();
      }
    }
  }, 100);

  // Сохраняем интервал для очистки
  gameState.progressCheckInterval = progressCheckInterval;
}

// Обработка провала уровня
function handleLevelFailed() {
  stopTimer();
  showLevelSkippedModal();
}

// Обработка завершения уровня
function handleLevelComplete() {
  stopTimer();
  gameState.addTimeBonus();
  completeLevel(false);
}

// Запустить таймер
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

// Остановить таймер
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Обработка истечения времени
function handleTimeUp() {
  gameState.endGame();
  showGameOverModal("Время вышло! ⏰", "К сожалению, время истекло.");
}

// Завершить вопрос с правильным ответом
export function handleCorrectAnswer(timeSpent = 0) {
  if (isPending) return;
  const earned = gameState.addCorrectAnswer(timeSpent);
  isPending = true;

  updateUI();

  // Показать визуальную обратную связь
  showFeedback(`+${earned} очков!`, "success");

  setTimeout(() => {
    nextQuestion();
    isPending = false;
  }, 2000);
}

// Завершить вопрос с неправильным ответом
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

// Следующий вопрос (не используется в игре с разрезанием)
function nextQuestion() {
  // Эта функция не нужна для игры "Разрежь фигуру"
  // Прогресс отслеживается в checkGameProgress()
}

// Завершить уровень
function completeLevel(isSkipped = false) {
  stopTimer();

  if (isSkipped) {
    // Уровень пропущен - очки не начисляются
    showLevelSkippedModal();
    return;
  }

  // Уровень пройден полностью - начисляем бонус за время
  gameState.addTimeBonus();

  const stats = gameState.getStats();

  // Сохраняем прогресс после каждого успешно пройденного уровня
  const totalPlayTime = Date.now() - gameState.startTime;
  const currentResult = {
    playerName: getCurrentPlayer(),
    score: stats.score,
    level: gameState.currentLevel,
    time: Math.floor(totalPlayTime / 1000),
    correctAnswers: stats.correctAnswers,
    wrongAnswers: stats.wrongAnswers,
    date: new Date().toISOString(),
    isComplete: false,
  };
  saveGameResult(currentResult);

  if (gameState.isGameComplete()) {
    // Игра полностью завершена
    completeGame();
  } else {
    // Показать модальное окно завершения уровня
    showLevelCompleteModal(stats);
  }
}

// Показать модальное окно завершения уровня
function showLevelCompleteModal(stats) {
  const progress = sliceGame.getProgress();

  document.getElementById("levelScore").textContent = stats.score;
  document.getElementById("levelCorrect").textContent = progress.currentCuts;
  document.getElementById("levelWrong").textContent = progress.currentPieces;

  levelCompleteModal.style.display = "flex";
}

// Показать модальное окно пропущенного уровня
function showLevelSkippedModal() {
  levelSkippedModal.style.display = "flex";
}

// Завершить игру
function completeGame() {
  const result = gameState.endGame();
  result.isComplete = true;
  saveGameResult(result);
  showGameOverModal("Поздравляем! 🎉", "Вы прошли все уровни!");
}

// Показать модальное окно окончания игры
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
      "Вы уверены, что хотите завершить уровень досрочно?\n\nВНИМАНИЕ: Очки за этот уровень НЕ будут начислены!"
    )
  ) {
    completeLevel(true);
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

  // Сбрасываем статистику уровня (очки остаются)
  gameState.resetLevelStats();
  // Перезапускаем текущий уровень
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

// Переход на страницу результатов во время игры
if (viewResultsFromGameBtn) {
  viewResultsFromGameBtn.addEventListener("click", () => {
    // Сохраняем состояние игры для возможности вернуться
    const gameStateData = {
      currentLevel: gameState.currentLevel,
      score: gameState.getStats().score,
      correctAnswers: gameState.getStats().correctAnswers,
      wrongAnswers: gameState.getStats().wrongAnswers,
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

// Предотвращение случайного закрытия страницы
window.addEventListener("beforeunload", (e) => {
  if (gameState.isGameActive) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// Запуск игры при загрузке страницы
document.addEventListener("DOMContentLoaded", initGame);
