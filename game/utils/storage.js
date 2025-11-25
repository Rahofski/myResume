// Модуль для работы с localStorage
// Управление сохранением и загрузкой игровых данных

const STORAGE_KEYS = {
  CURRENT_PLAYER: 'currentPlayer',
  LEADERBOARD: 'leaderboard',
  GAME_RESULTS: 'gameResults'
};

export function saveCurrentPlayer(playerName) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYER, playerName);
    return true;
  } catch (error) {
    console.error('Ошибка сохранения игрока:', error);
    return false;
  }
}

export function getCurrentPlayer() {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLAYER) || null;
  } catch (error) {
    console.error('Ошибка загрузки игрока:', error);
    return null;
  }
}

// Сохранить результат игры
export function saveGameResult(gameData) {
  try {
    const { playerName, score, level, time, date, correctAnswers, wrongAnswers, isComplete } = gameData;
    
    // Получаем существующий рейтинг
    const leaderboard = getLeaderboard();
    
    // Если это промежуточный результат, обновляем существующую запись того же игрока
    if (!isComplete) {
      const existingIndex = leaderboard.findIndex(
        entry => entry.playerName === playerName && !entry.isComplete
      );
      
      if (existingIndex !== -1) {
        // Обновляем существующую запись
        leaderboard[existingIndex] = {
          playerName,
          score,
          level,
          time,
          correctAnswers,
          wrongAnswers,
          date: date || new Date().toISOString(),
          isComplete: false
        };
      } else {
        // Добавляем новую запись
        leaderboard.push({
          playerName,
          score,
          level,
          time,
          correctAnswers,
          wrongAnswers,
          date: date || new Date().toISOString(),
          isComplete: false
        });
      }
    } else {
      // Удаляем промежуточную запись этого игрока
      const tempIndex = leaderboard.findIndex(
        entry => entry.playerName === playerName && !entry.isComplete
      );
      if (tempIndex !== -1) {
        leaderboard.splice(tempIndex, 1);
      }
      
      // Добавляем финальный результат
      leaderboard.push({
        playerName,
        score,
        level,
        time,
        correctAnswers,
        wrongAnswers,
        date: date || new Date().toISOString(),
        isComplete: true
      });
    }
    
    // Сортируем по убыванию очков
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Сохраняем обновленный рейтинг
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    
    return true;
  } catch (error) {
    console.error('Ошибка сохранения результата:', error);
    return false;
  }
}

// Получить рейтинг игроков
export function getLeaderboard(limit = null) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    const leaderboard = data ? JSON.parse(data) : [];
    
    // Если указан лимит, возвращаем топ N игроков
    return limit ? leaderboard.slice(0, limit) : leaderboard;
  } catch (error) {
    console.error('Ошибка загрузки рейтинга:', error);
    return [];
  }
}

// Получить топ игроков
export function getTopPlayers(count = 10) {
  return getLeaderboard(count);
}

export function getPlayerRank(playerName) {
  try {
    const leaderboard = getLeaderboard();
    const index = leaderboard.findIndex(entry => entry.playerName === playerName);
    return index >= 0 ? index + 1 : null;
  } catch (error) {
    console.error('Ошибка получения позиции:', error);
    return null;
  }
}

export function getPlayerBestScore(playerName) {
  try {
    const leaderboard = getLeaderboard();
    const playerResults = leaderboard.filter(entry => entry.playerName === playerName);
    
    if (playerResults.length === 0) return null;
    
    // Результаты уже отсортированы, берем первый
    return playerResults[0];
  } catch (error) {
    console.error('Ошибка получения лучшего результата:', error);
    return null;
  }
}

// Очистить весь рейтинг
export function clearLeaderboard() {
  try {
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    return true;
  } catch (error) {
    console.error('Ошибка очистки рейтинга:', error);
    return false;
  }
}

// Очистить текущего игрока
export function clearCurrentPlayer() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAYER);
    return true;
  } catch (error) {
    console.error('Ошибка очистки игрока:', error);
    return false;
  }
}

// Экспорт всех данных в JSON
export function exportData() {
  try {
    return {
      currentPlayer: getCurrentPlayer(),
      leaderboard: getLeaderboard()
    };
  } catch (error) {
    console.error('Ошибка экспорта данных:', error);
    return null;
  }
}

// Импорт данных из JSON
export function importData(data) {
  try {
    if (data.currentPlayer) {
      saveCurrentPlayer(data.currentPlayer);
    }
    if (data.leaderboard) {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(data.leaderboard));
    }
    return true;
  } catch (error) {
    console.error('Ошибка импорта данных:', error);
    return false;
  }
}
