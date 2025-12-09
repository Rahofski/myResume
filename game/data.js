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
    instruction: "Разрежь треугольник пополам одним разрезом",
  },
  {
    level: 2,
    sides: 4,
    targetCuts: 2,
    targetPieces: 3,
    timeLimit: 45,
    instruction: "Разрежь четырёхугольник на 3 части двумя разрезами",
  },
  {
    level: 3,
    sides: 5,
    targetCuts: 2,
    targetPieces: 4,
    timeLimit: 45,
    instruction: "Разрежь пятиугольник на 4 части двумя разрезами",
  },
  {
    level: 4,
    sides: 6,
    targetCuts: 3,
    targetPieces: 5,
    timeLimit: 30,
    instruction:
      "⚡ Разрежь движущийся шестиугольник на 5 частей тремя разрезами",
  },
  {
    level: 5,
    sides: 7,
    targetCuts: 3,
    targetPieces: 4,
    timeLimit: 30,
    instruction:
      "⚡ Разрежь движущийся семиугольник на 4 части тремя разрезами",
  },
  {
    level: 6,
    sides: 8,
    targetCuts: 4,
    targetPieces: 5,
    timeLimit: 30,
    instruction:
      "⚡ Разрежь движущийся восьмиугольник на 5 частей четырьмя разрезами",
  },
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
