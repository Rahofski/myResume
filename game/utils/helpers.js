// Вспомогательные функции для игры

// Форматирование времени в MM:SS
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Форматирование даты
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Перемешать массив (алгоритм Фишера-Йетса)
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Получить случайный элемент из массива
export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Получить N случайных уникальных элементов из массива
export function getRandomElements(array, count) {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

// Валидация имени игрока
export function validatePlayerName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Имя не может быть пустым' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, error: 'Имя должно содержать минимум 2 символа' };
  }
  
  if (name.trim().length > 20) {
    return { valid: false, error: 'Имя не может быть длиннее 20 символов' };
  }
  
  return { valid: true };
}

// Расчет процента точности
export function calculateAccuracy(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

// Получить ранг игрока по очкам
export function getPlayerGrade(score) {
  if (score >= 500) return { grade: 'S', color: '#FFD700' }; // Золотой
  if (score >= 400) return { grade: 'A', color: '#C0C0C0' }; // Серебро
  if (score >= 300) return { grade: 'B', color: '#CD7F32' }; // Бронза
  if (score >= 200) return { grade: 'C', color: '#4CAF50' }; // Зеленый
  if (score >= 100) return { grade: 'D', color: '#2196F3' }; // Синий
  return { grade: 'E', color: '#9E9E9E' }; // Серый
}

// Debounce функция для оптимизации событий
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Проверка поддержки localStorage
export function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Создание UUID (для уникальных идентификаторов)
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Анимация появления элемента
export function animateElement(element, animationClass, duration = 1000) {
  return new Promise((resolve) => {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
      resolve();
    }, duration);
  });
}

// Воспроизведение звукового эффекта (если добавлены звуки)
export function playSound(soundName) {
  // Заглушка для будущей реализации звуков
  console.log(`Playing sound: ${soundName}`);
}

// Вибрация (для мобильных устройств)
export function vibrate(pattern = 100) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

// Показать уведомление
export function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
}

// Копировать текст в буфер обмена
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Проверка на мобильное устройство
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Полноэкранный режим
export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Генерация случайного цвета
export function randomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

// Интерполяция между двумя значениями
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Ограничение значения в диапазоне
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}


export function generateNickname() {
  const adjectives = [
    "Быстрый",
    "Смелый",
    "Умный",
    "Весёлый",
    "Ловкий",
    "Дикий",
    "Корявый",
    "Мохнатый",
    "Грозный",
    "Зелёный",
    "Грязный",
    "Солёный",
    "Острый",
    "Тихий",
    "Шумный",
    "Бомбический",
    "Вихревой",
    "Прыгающий",
    "Летающий",
    "Пламенный",
    "Волосатый"
  ];
  const animals = [
    "Лев",
    "Тигр",
    "Медведь",
    "Волк",
    "Сокол",
    "Банан",
    "Огурец",
    'Джонни',
    'Печенег',
    'Лягушонок',
    'Керасин',
    'Пират',
    'Варвар',
    'Гладиатор',
    'Баловник',
    'Шут',
    'Котик',
    'Пёсик',
    'Ежик',
    'Зайчик'
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomNick = randomAdjective + " " + randomAnimal;
  return randomNick;
}
