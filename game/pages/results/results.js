// Скрипт страницы результатов
import { getCurrentPlayer, getLeaderboard, getPlayerBestScore, getPlayerRank, exportData, clearLeaderboard } from '../../utils/storage.js';

// DOM элементы
const playerNameElement = document.getElementById('playerName');
const finalScoreElement = document.getElementById('finalScore');
const finalLevelElement = document.getElementById('finalLevel');
const gameTimeElement = document.getElementById('gameTime');
const correctAnswersElement = document.getElementById('correctAnswers');
const wrongAnswersElement = document.getElementById('wrongAnswers');
const accuracyElement = document.getElementById('accuracy');

const leaderboardBodyElement = document.getElementById('leaderboardBody');
const totalGamesElement = document.getElementById('totalGames');
const bestScoreElement = document.getElementById('bestScore');
const playerRankElement = document.getElementById('playerRank');

// Кнопки
const playAgainBtn = document.getElementById('playAgainBtn');
const newPlayerBtn = document.getElementById('newPlayerBtn');
const exportBtn = document.getElementById('exportBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const returnToGameBtn = document.getElementById('returnToGameBtn');
const filterButtons = document.querySelectorAll('.filter-btn');

// Текущие данные
let currentPlayerName = '';
let allResults = [];
let currentFilter = 'all';

function initResults() {
  currentPlayerName = getCurrentPlayer();
  
  if (!currentPlayerName) {
    alert('Необходимо авторизоваться!');
    window.location.href = '../auth/auth.html';
    return;
  }
  
  // Проверяем, пришли ли мы из игры
  const tempGameState = localStorage.getItem('tempGameState');
  if (tempGameState) {
    returnToGameBtn.style.display = 'inline-block';
  }
  
  loadPlayerResults();
  loadLeaderboard();
}

// Загрузить результаты игрока
function loadPlayerResults() {
  playerNameElement.textContent = currentPlayerName;
  
  // Получаем лучший завершенный результат игрока
  const leaderboard = getLeaderboard();
  const completedResults = leaderboard.filter(
    entry => entry.playerName === currentPlayerName && entry.isComplete
  );
  const bestResult = completedResults.length > 0 ? completedResults[0] : null;
  
  // Скрываем секцию результатов, если нет завершенных игр
  const playerResultsSection = document.querySelector('.player-results');
  if (!bestResult) {
    playerResultsSection.style.display = 'none';
    return;
  }
  
  playerResultsSection.style.display = 'block';
  
  if (bestResult) {
    finalScoreElement.textContent = bestResult.score;
    finalLevelElement.textContent = bestResult.level;
    
    // Форматируем время
    const minutes = Math.floor(bestResult.time / 60);
    const seconds = bestResult.time % 60;
    gameTimeElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else {
    // Нет результатов
    finalScoreElement.textContent = '0';
    finalLevelElement.textContent = '0';
    gameTimeElement.textContent = '00:00';
  }
  
  // Получаем позицию в рейтинге
  const rank = getPlayerRank(currentPlayerName);
  playerRankElement.textContent = rank ? `#${rank}` : '-';
}

// Загрузить рейтинг
function loadLeaderboard() {
  allResults = getLeaderboard();
  
  // Обновляем статистику
  totalGamesElement.textContent = allResults.length;
  bestScoreElement.textContent = allResults.length > 0 ? allResults[0].score : 0;
  
  displayLeaderboard(allResults);
}

// Отобразить рейтинг
function displayLeaderboard(results) {
  leaderboardBodyElement.innerHTML = '';
  
  if (results.length === 0) {
    leaderboardBodyElement.innerHTML = '<tr><td colspan="6" class="no-data">Нет данных</td></tr>';
    return;
  }
  
  results.forEach((result, index) => {
    const row = document.createElement('tr');
    
    if (result.playerName === currentPlayerName) {
      row.classList.add('current-player');
    }
    
    // Медали для топ-3
    let rankDisplay = index + 1;
    if (index === 0) rankDisplay = '🥇';
    else if (index === 1) rankDisplay = '🥈';
    else if (index === 2) rankDisplay = '🥉';
    
    // Форматируем время
    const minutes = Math.floor(result.time / 60);
    const seconds = result.time % 60;
    const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const date = new Date(result.date);
    const dateDisplay = date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    case 'top10':
      filteredResults = allResults.slice(0, 10);
      break;
    case 'player':
      filteredResults = allResults.filter(result => result.playerName === currentPlayerName);
      break;
    case 'all':
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
    alert('Ошибка экспорта данных');
    return;
  }
  
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `game-data-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

function clearRanking() {
  if (confirm('Вы уверены, что хотите удалить весь рейтинг? Это действие нельзя отменить.')) {
    if (clearLeaderboard()) {
      alert('Рейтинг очищен');
      loadLeaderboard();
      loadPlayerResults();
    } else {
      alert('Ошибка при очистке рейтинга');
    }
  }
}

// Обработчики событий
playAgainBtn.addEventListener('click', () => {
  window.location.href = '../game/game.html';
});

newPlayerBtn.addEventListener('click', () => {
  if (confirm('Начать игру с новым игроком?')) {
    window.location.href = '../auth/auth.html';
  }
});

exportBtn.addEventListener('click', exportDataToFile);

clearDataBtn.addEventListener('click', clearRanking);

// Фильтры
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Убираем active со всех кнопок
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Добавляем active на текущую
    button.classList.add('active');
    
    // Применяем фильтр
    const filter = button.dataset.filter;
    filterLeaderboard(filter);
  });
});

// Обработка клавиш
document.addEventListener('keydown', (e) => {
  // Enter - играть снова
  if (e.key === 'Enter') {
    playAgainBtn.click();
  }
  
  // N - новый игрок
  if (e.key.toLowerCase() === 'n') {
    newPlayerBtn.click();
  }
});

// Двойной клик по строке таблицы для копирования имени игрока
leaderboardBodyElement.addEventListener('dblclick', (e) => {
  const row = e.target.closest('tr');
  if (row && !row.querySelector('.no-data')) {
    const playerCell = row.querySelector('.player');
    if (playerCell) {
      const playerName = playerCell.textContent;
      navigator.clipboard.writeText(playerName).then(() => {
        // Визуальная обратная связь
        playerCell.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
          playerCell.style.backgroundColor = '';
        }, 300);
      });
    }
  }
});

// Вернуться к игре
returnToGameBtn.addEventListener('click', () => {
  // Удаляем временное состояние и возвращаемся к игре
  localStorage.removeItem('tempGameState');
  window.location.href = '../game/game.html';
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initResults);
