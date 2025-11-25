// Файл данных для игры "Разрежь фигуру"

/**
 * Конфигурация уровней игры
 * sides - количество углов фигуры
 * targetCuts - необходимое количество разрезов
 * targetPieces - необходимое количество кусков
 * timeLimit - ограничение времени в секундах
 * instruction - инструкция для игрока
 */
export const LEVELS = [
  {
    level: 1,
    sides: 3,
    targetCuts: 1,
    targetPieces: 2,
    timeLimit: 60,
    instruction: "Разрежь треугольник пополам одним разрезом"
  },
  {
    level: 2,
    sides: 4,
    targetCuts: 2,
    targetPieces: 3,
    timeLimit: 45,
    instruction: "Разрежь четырёхугольник на 3 части двумя разрезами"
  },
  {
    level: 3,
    sides: 5,
    targetCuts: 2,
    targetPieces: 3,
    timeLimit: 45,
    instruction: "Разрежь пятиугольник на 3 части двумя разрезами"
  },
  {
    level: 4,
    sides: 6,
    targetCuts: 3,
    targetPieces: 4,
    timeLimit: 30,
    instruction: "Разрежь шестиугольник на 4 части тремя разрезами"
  },
  {
    level: 5,
    sides: 7,
    targetCuts: 3,
    targetPieces: 4,
    timeLimit: 30,
    instruction: "Разрежь семиугольник на 4 части тремя разрезами"
  },
  {
    level: 6,
    sides: 8,
    targetCuts: 4,
    targetPieces: 5,
    timeLimit: 30,
    instruction: "Разрежь восьмиугольник на 5 частей четырьмя разрезами"
  }
];

/**
 * Получить конфигурацию уровня по номеру
 */
export function getLevelConfig(levelNumber) {
  return LEVELS[levelNumber - 1] || LEVELS[0];
}

/**
 * Получить максимальное количество уровней
 */
export function getMaxLevel() {
  return LEVELS.length;
}

// Пример старой структуры данных (можно удалить):
/*
export const questions = [
  { text: "У кого 4 ноги?", property: "legs", value: 4 },
  { text: "Кто умеет летать?", property: "hasWings", value: true },
  // ... еще вопросы
];
*/

// Пока оставляем пустым - заполнится когда определится тема игры
export const gameData = {
  level1: {},
  level2: {},
  level3: {}
};

// Константы игры
export const GAME_CONSTANTS = {
  QUESTIONS_PER_LEVEL: 5,
  MAX_LEVELS: 3,
  TIME_LIMITS: {
    1: 60,
    2: 45,
    3: 30
  }
};
