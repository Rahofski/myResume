import { getMaxLevel } from "../data.js";

class GameState {
  constructor() {
    this.playerName = "";
    this.currentLevel = 1;
    this.maxLevel = getMaxLevel();
    this.score = 0;
    this.levelScore = 0; // Очки за текущий уровень
    this.timeRemaining = 0;
    this.totalTime = 0;
    this.questionsPerLevel = 5;
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.isGameActive = false;
    this.isPaused = false;
    this.startTime = null;
    this.levelStartTime = null;
    this.progressCheckInterval = null;

    // Настройки очков
    this.scoreSettings = {
      correctAnswer: 10,
      wrongAnswer: -5,
      timeBonus: 2,
      levelMultiplier: {
        1: 1,
        2: 1.5,
        3: 2,
        4: 2.5,
        5: 3,
        6: 3.5,
      },
    };

    this.timeLimits = {
      1: 60,
      2: 45,
      3: 45,
      4: 30,
      5: 30,
      6: 30,
    };
  }

  initGame(playerName) {
    this.playerName = playerName;
    this.currentLevel = 1;
    this.score = 0;
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.isGameActive = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this.startLevel(1);
  }

  // Начать новый уровень
  startLevel(level) {
    this.currentLevel = level;
    this.currentQuestion = 0;
    this.levelScore = 0; // Сбрасываем очки за уровень
    this.timeRemaining = this.timeLimits[level];
    this.totalTime = this.timeLimits[level];
    this.levelStartTime = Date.now();
  }

  resetLevelStats() {
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    // Очки остаются, так как они за всю игру
  }

  nextLevel() {
    if (this.currentLevel < this.maxLevel) {
      this.currentLevel++;
      this.startLevel(this.currentLevel);
      return true;
    }
    return false;
  }

  nextQuestion() {
    this.currentQuestion++;
    return this.currentQuestion < this.questionsPerLevel;
  }

  isLevelComplete() {
    return this.currentQuestion >= this.questionsPerLevel;
  }

  isGameComplete() {
    return this.currentLevel >= this.maxLevel;
  }

  addCorrectAnswer(timeSpent = 0) {
    this.correctAnswers++;
    const baseScore = this.scoreSettings.correctAnswer;
    const multiplier = this.scoreSettings.levelMultiplier[this.currentLevel];

    // Бонус за скорость (если ответил быстрее половины времени)
    const halfTime = this.totalTime / 2;
    const speedBonus =
      timeSpent < halfTime
        ? Math.floor((halfTime - timeSpent) * this.scoreSettings.timeBonus)
        : 0;

    const earnedPoints = Math.floor((baseScore + speedBonus) * multiplier);
    this.score += earnedPoints;
    this.levelScore += earnedPoints; // Добавляем в очки за уровень

    return earnedPoints;
  }

  addWrongAnswer() {
    this.wrongAnswers++;
    const penalty = this.scoreSettings.wrongAnswer;
    this.score += penalty; // Штраф (отрицательное число)
    this.levelScore += penalty; // Добавляем в очки за уровень
    return penalty;
  }

  addTimeBonus() {
    const bonus = Math.floor(
      this.timeRemaining *
        this.scoreSettings.timeBonus *
        this.scoreSettings.levelMultiplier[this.currentLevel]
    );
    this.score += bonus;
    this.levelScore += bonus; // Добавляем в очки за уровень
    return bonus;
  }

  updateTime(seconds) {
    this.timeRemaining = seconds;
  }

  decrementTime() {
    if (this.timeRemaining > 0) {
      this.timeRemaining--;
      return this.timeRemaining;
    }
    return 0;
  }

  isTimeUp() {
    return this.timeRemaining <= 0;
  }

  pauseGame() {
    this.isPaused = true;
  }

  resumeGame() {
    this.isPaused = false;
  }

  endGame() {
    this.isGameActive = false;
    const totalPlayTime = Date.now() - this.startTime;
    return {
      playerName: this.playerName,
      score: Math.max(0, this.score), // Не может быть отрицательным
      level: this.currentLevel,
      time: Math.floor(totalPlayTime / 1000),
      correctAnswers: this.correctAnswers,
      wrongAnswers: this.wrongAnswers,
      date: new Date().toISOString(),
    };
  }

  getStats() {
    return {
      playerName: this.playerName,
      level: this.currentLevel,
      score: this.score,
      levelScore: this.levelScore, // Очки за текущий уровень
      timeRemaining: this.timeRemaining,
      currentQuestion: this.currentQuestion + 1,
      totalQuestions: this.questionsPerLevel,
      correctAnswers: this.correctAnswers,
      wrongAnswers: this.wrongAnswers,
      progress: ((this.currentQuestion / this.questionsPerLevel) * 100).toFixed(
        0
      ),
    };
  }

  // Получить состояние в виде объекта
  getState() {
    return {
      playerName: this.playerName,
      currentLevel: this.currentLevel,
      score: this.score,
      timeRemaining: this.timeRemaining,
      currentQuestion: this.currentQuestion,
      correctAnswers: this.correctAnswers,
      wrongAnswers: this.wrongAnswers,
      isGameActive: this.isGameActive,
      isPaused: this.isPaused,
    };
  }

  reset() {
    this.playerName = "";
    this.currentLevel = 1;
    this.score = 0;
    this.timeRemaining = 0;
    this.totalTime = 0;
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.isGameActive = false;
    this.isPaused = false;
    this.startTime = null;
    this.levelStartTime = null;
  }
}

const gameState = new GameState();

export default gameState;
