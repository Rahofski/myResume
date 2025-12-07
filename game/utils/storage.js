// Модуль для работы с localStorage
// Управление сохранением и загрузкой игровых данных

const STORAGE_KEYS = {
  CURRENT_PLAYER: "currentPlayer",
  LEADERBOARD: "leaderboard",
  GAME_RESULTS: "gameResults",
  USERS: "users",
};

export function saveCurrentPlayer(playerName) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYER, playerName);
    return true;
  } catch (error) {
    console.error("Ошибка сохранения игрока:", error);
    return false;
  }
}

export function getCurrentPlayer() {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLAYER) || null;
  } catch (error) {
    console.error("Ошибка загрузки игрока:", error);
    return null;
  }
}

// Функции для работы с пользователями
function getUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Ошибка загрузки пользователей:", error);
    return {};
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error("Ошибка сохранения пользователей:", error);
    return false;
  }
}

// Простое хеширование пароля (для демонстрации)
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString();
}

// Регистрация нового пользователя
export function registerUser(nickname, password) {
  try {
    const users = getUsers();

    if (users[nickname]) {
      return {
        success: false,
        message: "Пользователь с таким никнеймом уже существует.",
      };
    }

    users[nickname] = {
      passwordHash: hashPassword(password),
      registeredAt: new Date().toISOString(),
    };

    if (saveUsers(users)) {
      return { success: true, message: "Регистрация успешна!" };
    } else {
      return { success: false, message: "Ошибка сохранения данных." };
    }
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return { success: false, message: "Произошла ошибка при регистрации." };
  }
}

// Авторизация пользователя
export function loginUser(nickname, password) {
  try {
    const users = getUsers();

    if (!users[nickname]) {
      return { success: false, message: "Пользователь не найден." };
    }

    const user = users[nickname];
    if (user.passwordHash !== hashPassword(password)) {
      return { success: false, message: "Неверный пароль." };
    }

    return { success: true, message: "Вход выполнен успешно!" };
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return { success: false, message: "Произошла ошибка при авторизации." };
  }
}

// Сохранить результат игры
export function saveGameResult(gameData) {
  try {
    const { playerName, score, level, time, date, correctAnswers, wrongAnswers, isComplete } = gameData;
    
    const leaderboard = getLeaderboard();
    
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
    
    leaderboard.sort((a, b) => b.score - a.score);
    
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    
    return true;
  } catch (error) {
    console.error('Ошибка сохранения результата:', error);
    return false;
  }
}

export function getLeaderboard(limit = null) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    const leaderboard = data ? JSON.parse(data) : [];
    
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
    
    return playerResults[0];
  } catch (error) {
    console.error('Ошибка получения лучшего результата:', error);
    return null;
  }
}

export function clearLeaderboard() {
  try {
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    return true;
  } catch (error) {
    console.error('Ошибка очистки рейтинга:', error);
    return false;
  }
}

export function clearCurrentPlayer() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAYER);
    return true;
  } catch (error) {
    console.error('Ошибка очистки игрока:', error);
    return false;
  }
}

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
