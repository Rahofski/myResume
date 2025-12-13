// Модуль для работы с localStorage
// Управление сохранением и загрузкой игровых данных

const STORAGE_KEYS = {
  CURRENT_PLAYER: "currentPlayer",
  LEADERBOARD: "leaderboard",
  GAME_RESULTS: "gameResults",
  USERS: "users",
  PLAYER_PROGRESS: "playerProgress",
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

export function checkAuthAndRedirect(redirectUrl = "../auth/auth.html") {
  const currentPlayer = getCurrentPlayer();
  if (!currentPlayer) {
    alert("Для доступа к игре необходимо авторизоваться!");
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

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

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString();
}

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

export function saveGameResult(gameData) {
  try {
    const {
      playerName,
      score,
      level,
      time,
      date,
      correctAnswers,
      wrongAnswers,
      isComplete,
    } = gameData;

    const leaderboard = getLeaderboard();

    if (!isComplete) {
      const existingIndex = leaderboard.findIndex(
        (entry) => entry.playerName === playerName && !entry.isComplete
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
          isComplete: false,
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
          isComplete: false,
        });
      }
    } else {
      const tempIndex = leaderboard.findIndex(
        (entry) => entry.playerName === playerName && !entry.isComplete
      );
      if (tempIndex !== -1) {
        leaderboard.splice(tempIndex, 1);
      }

      leaderboard.push({
        playerName,
        score,
        level,
        time,
        correctAnswers,
        wrongAnswers,
        date: date || new Date().toISOString(),
        isComplete: true,
      });
    }

    leaderboard.sort((a, b) => b.score - a.score);

    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));

    return true;
  } catch (error) {
    console.error("Ошибка сохранения результата:", error);
    return false;
  }
}

export function getLeaderboard(limit = null) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    const leaderboard = data ? JSON.parse(data) : [];

    return limit ? leaderboard.slice(0, limit) : leaderboard;
  } catch (error) {
    console.error("Ошибка загрузки рейтинга:", error);
    return [];
  }
}

export function getTopPlayers(count = 10) {
  return getLeaderboard(count);
}

export function getPlayerRank(playerName) {
  try {
    const leaderboard = getLeaderboard();
    const index = leaderboard.findIndex(
      (entry) => entry.playerName === playerName
    );
    return index >= 0 ? index + 1 : null;
  } catch (error) {
    console.error("Ошибка получения позиции:", error);
    return null;
  }
}

export function getPlayerBestScore(playerName) {
  try {
    const leaderboard = getLeaderboard();
    const playerResults = leaderboard.filter(
      (entry) => entry.playerName === playerName
    );

    if (playerResults.length === 0) return null;

    return playerResults[0];
  } catch (error) {
    console.error("Ошибка получения лучшего результата:", error);
    return null;
  }
}

export function clearLeaderboard() {
  try {
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    return true;
  } catch (error) {
    console.error("Ошибка очистки рейтинга:", error);
    return false;
  }
}

export function clearCurrentPlayer() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAYER);
    return true;
  } catch (error) {
    console.error("Ошибка очистки игрока:", error);
    return false;
  }
}

export function exportData() {
  try {
    return {
      currentPlayer: getCurrentPlayer(),
      leaderboard: getLeaderboard(),
    };
  } catch (error) {
    console.error("Ошибка экспорта данных:", error);
    return null;
  }
}

export function importData(data) {
  try {
    if (data.currentPlayer) {
      saveCurrentPlayer(data.currentPlayer);
    }
    if (data.leaderboard) {
      localStorage.setItem(
        STORAGE_KEYS.LEADERBOARD,
        JSON.stringify(data.leaderboard)
      );
    }
    return true;
  } catch (error) {
    console.error("Ошибка импорта данных:", error);
    return false;
  }
}

// ===== ПРОГРЕСС ИГРОКА ПО УРОВНЯМ =====

/**
 * Получить прогресс игрока
 * Возвращает объект: { maxUnlockedLevel: number, levelScores: { [level]: score } }
 */
export function getPlayerProgress(playerName) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER_PROGRESS);
    const allProgress = data ? JSON.parse(data) : {};

    return (
      allProgress[playerName] || {
        maxUnlockedLevel: 1,
        levelScores: {},
      }
    );
  } catch (error) {
    console.error("Ошибка получения прогресса:", error);
    return { maxUnlockedLevel: 1, levelScores: {} };
  }
}

/**
 * Сохранить результат уровня
 * Обновляет maxUnlockedLevel и сохраняет максимальный score за уровень
 */
export function saveLevelResult(playerName, level, score) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER_PROGRESS);
    const allProgress = data ? JSON.parse(data) : {};

    if (!allProgress[playerName]) {
      allProgress[playerName] = {
        maxUnlockedLevel: 1,
        levelScores: {},
      };
    }

    const progress = allProgress[playerName];

    // Сохраняем максимальный score за уровень (не меньше 0)
    const currentBest = progress.levelScores[level] || 0;
    progress.levelScores[level] = Math.max(currentBest, Math.max(0, score));

    // Разблокируем следующий уровень если прошли текущий
    if (level >= progress.maxUnlockedLevel && level < 6) {
      progress.maxUnlockedLevel = level + 1;
    }

    localStorage.setItem(
      STORAGE_KEYS.PLAYER_PROGRESS,
      JSON.stringify(allProgress)
    );
    return true;
  } catch (error) {
    console.error("Ошибка сохранения результата уровня:", error);
    return false;
  }
}

/**
 * Получить общий счёт игрока (сумма лучших результатов по всем уровням)
 */
export function getTotalScore(playerName) {
  const progress = getPlayerProgress(playerName);
  return Object.values(progress.levelScores).reduce(
    (sum, score) => sum + score,
    0
  );
}

/**
 * Проверить, разблокирован ли уровень
 */
export function isLevelUnlocked(playerName, level) {
  const progress = getPlayerProgress(playerName);
  return level <= progress.maxUnlockedLevel;
}

/**
 * Сбросить прогресс игрока (все уровни закрываются, только первый доступен)
 */
export function resetPlayerProgress(playerName) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER_PROGRESS);
    const allProgress = data ? JSON.parse(data) : {};

    // Сбрасываем прогресс игрока
    allProgress[playerName] = {
      maxUnlockedLevel: 1,
      levelScores: {},
    };

    localStorage.setItem(
      STORAGE_KEYS.PLAYER_PROGRESS,
      JSON.stringify(allProgress)
    );
    return true;
  } catch (error) {
    console.error("Ошибка сброса прогресса:", error);
    return false;
  }
}
