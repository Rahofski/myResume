// Скрипт страницы результатов
import {
  clearLeaderboard,
  exportData,
  getCurrentPlayer,
  getLeaderboard,
  getPlayerRank,
  resetPlayerProgress,
} from "../../utils/storage.js";

// DOM элементы
const playerNameElement = document.getElementById("playerName");
const finalScoreElement = document.getElementById("finalScore");
const finalLevelElement = document.getElementById("finalLevel");
const gameTimeElement = document.getElementById("gameTime");

const leaderboardBodyElement = document.getElementById("leaderboardBody");
const totalGamesElement = document.getElementById("totalGames");
const bestScoreElement = document.getElementById("bestScore");
const playerRankElement = document.getElementById("playerRank");

// Кнопки
const playAgainBtn = document.getElementById("playAgainBtn");
const newPlayerBtn = document.getElementById("newPlayerBtn");
const exportBtn = document.getElementById("exportBtn");
const clearDataBtn = document.getElementById("clearDataBtn");
const returnToGameBtn = document.getElementById("returnToGameBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

// Текущие данные
let currentPlayerName = "";
let allResults = [];
let currentFilter = "all";

function initResults() {
  currentPlayerName = getCurrentPlayer();

  if (!currentPlayerName) {
    alert("Необходимо авторизоваться!");
    window.location.href = "../auth/auth.html";
    return;
  }

  const tempGameState = localStorage.getItem("tempGameState");
  if (tempGameState) {
    try {
      const savedState = JSON.parse(tempGameState);

      returnToGameBtn.style.display = "inline-block";
      returnToGameBtn.textContent = "← Продолжить игру";
      playAgainBtn.textContent = "Начать заново";

      if (savedState.gameComplete) {
        showCompletionMessage();
      }
    } catch (e) {
      console.error("Ошибка чтения состояния:", e);
    }
  }

  loadPlayerResults();
  loadLeaderboard();
}

// Показать поздравление с прохождением игры
function showCompletionMessage() {
  const header = document.querySelector(".results-header h1");
  if (header) {
    header.textContent = "🎉 Поздравляем! Вы прошли все уровни!";
  }
}

function loadPlayerResults() {
  playerNameElement.textContent = currentPlayerName;

  const leaderboard = getLeaderboard();
  const completedResults = leaderboard.filter(
    (entry) => entry.playerName === currentPlayerName && entry.isComplete
  );
  const bestResult = completedResults.length > 0 ? completedResults[0] : null;

  const playerResultsSection = document.querySelector(".player-results");
  if (!bestResult) {
    playerResultsSection.style.display = "none";
    return;
  }

  playerResultsSection.style.display = "block";

  if (bestResult) {
    finalScoreElement.textContent = bestResult.score;
    finalLevelElement.textContent = bestResult.level;

    const minutes = Math.floor(bestResult.time / 60);
    const seconds = bestResult.time % 60;
    gameTimeElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    finalScoreElement.textContent = "0";
    finalLevelElement.textContent = "0";
    gameTimeElement.textContent = "00:00";
  }

  const rank = getPlayerRank(currentPlayerName);
  playerRankElement.textContent = rank ? `#${rank}` : "-";
}

// Загрузить рейтинг
function loadLeaderboard() {
  allResults = getLeaderboard();

  totalGamesElement.textContent = allResults.length;
  bestScoreElement.textContent =
    allResults.length > 0 ? allResults[0].score : 0;

  displayLeaderboard(allResults);
}

function displayLeaderboard(results) {
  leaderboardBodyElement.innerHTML = "";

  if (results.length === 0) {
    leaderboardBodyElement.innerHTML =
      '<tr><td colspan="6" class="no-data">Нет данных</td></tr>';
    return;
  }

  results.forEach((result, index) => {
    const row = document.createElement("tr");

    if (result.playerName === currentPlayerName) {
      row.classList.add("current-player");
    }

    let rankDisplay = index + 1;
    if (index === 0) rankDisplay = "🥇";
    else if (index === 1) rankDisplay = "🥈";
    else if (index === 2) rankDisplay = "🥉";

    const minutes = Math.floor(result.time / 60);
    const seconds = result.time % 60;
    const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const date = new Date(result.date);
    const dateDisplay = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    row.innerHTML = `
      <td class="rank">${rankDisplay}</td>
      <td class="player">${result.playerName}</td>
      <td class="score">${result.score}</td>
      <td>${result.level}/6</td>
      <td>${timeDisplay}</td>
      <td class="date">${dateDisplay}</td>
    `;

    leaderboardBodyElement.appendChild(row);
  });
}

// Фильтрация рейтинга
function filterLeaderboard(filter) {
  currentFilter = filter;

  let filteredResults = [];

  switch (filter) {
    case "top10":
      filteredResults = allResults.slice(0, 10);
      break;
    case "player":
      filteredResults = allResults.filter(
        (result) => result.playerName === currentPlayerName
      );
      break;
    case "all":
    default:
      filteredResults = allResults;
      break;
  }

  displayLeaderboard(filteredResults);
}

// Экспорт данных
function exportDataToFile() {
  const data = exportData();

  if (!data) {
    alert("Ошибка экспорта данных");
    return;
  }

  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `game-data-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function clearRanking() {
  if (
    confirm(
      "Вы уверены, что хотите удалить весь рейтинг? Это действие нельзя отменить."
    )
  ) {
    if (clearLeaderboard()) {
      alert("Рейтинг очищен");
      loadLeaderboard();
      loadPlayerResults();
    } else {
      alert("Ошибка при очистке рейтинга");
    }
  }
}

playAgainBtn.addEventListener("click", () => {
  localStorage.removeItem("tempGameState");
  resetPlayerProgress(currentPlayerName);
  window.location.href = "../game/game.html";
});

newPlayerBtn.addEventListener("click", () => {
  if (confirm("Начать игру с новым игроком?")) {
    window.location.href = "../auth/auth.html";
  }
});

exportBtn.addEventListener("click", exportDataToFile);

clearDataBtn.addEventListener("click", clearRanking);

// Фильтры
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    const filter = button.dataset.filter;
    filterLeaderboard(filter);
  });
});

// Обработка клавиш
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    playAgainBtn.click();
  }

  if (e.key.toLowerCase() === "n") {
    newPlayerBtn.click();
  }
});

leaderboardBodyElement.addEventListener("dblclick", (e) => {
  const row = e.target.closest("tr");
  if (row && !row.querySelector(".no-data")) {
    const playerCell = row.querySelector(".player");
    if (playerCell) {
      const playerName = playerCell.textContent;
      navigator.clipboard.writeText(playerName).then(() => {
        // Визуальная обратная связь
        playerCell.style.backgroundColor = "#4CAF50";
        setTimeout(() => {
          playerCell.style.backgroundColor = "";
        }, 300);
      });
    }
  }
});

returnToGameBtn.addEventListener("click", () => {
  window.location.href = "../game/game.html";
});

document.addEventListener('DOMContentLoaded', initResults);
