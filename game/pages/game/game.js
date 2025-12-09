// Основной скрипт игры "Разрежь фигуру"
import gameState from "../../utils/gameState.js";
import { getCurrentPlayer, saveGameResult } from "../../utils/storage.js";
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

  updateUI();
  showLevelIntro(1);
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
    timerElement.style.color = "#333";
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

  const progress = sliceGame.getProgress();
  const failureReasonElement = document.getElementById("failureReason");

  if (progress.cuts > progress.targetCuts) {
    failureReasonElement.textContent = `Слишком много разрезов! Сделано ${progress.currentCuts}, нужно ${progress.targetCuts}`;
  } else if (progress.currentPieces > progress.targetPieces) {
    failureReasonElement.textContent = `Слишком много кусков! Получилось ${progress.currentPieces}, нужно ${progress.targetPieces}`;
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
  gameState.endGame();
  showGameOverModal("Время вышло! ⏰", "К сожалению, время истекло.");
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
    completeGame();
  } else {
    showLevelCompleteModal(stats);
  }
}

function showLevelCompleteModal(stats) {
  const progress = sliceGame.getProgress();

  document.getElementById("levelScore").textContent = stats.score;
  document.getElementById("levelCorrect").textContent = progress.currentCuts;
  document.getElementById("levelWrong").textContent = progress.currentPieces;

  levelCompleteModal.style.display = "flex";
}

function showLevelSkippedModal() {
  levelSkippedModal.style.display = "flex";
}

function completeGame() {
  const result = gameState.endGame();
  result.isComplete = true;
  saveGameResult(result);
  showGameOverModal("Поздравляем! 🎉", "Вы прошли все уровни!");
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

if (viewResultsFromGameBtn) {
  viewResultsFromGameBtn.addEventListener("click", () => {
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
