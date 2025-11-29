// Класс для игры "Разрежь фигуру"
import { 
  generateConvexPolygon, 
  isPointInPolygon, 
  findPolygonIntersections,
  distance,
  lineIntersection
} from './geometry.js';

export class SliceGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.polygon = null;
    this.cuts = [];
    this.currentCut = null;
    this.isDrawing = false;
    this.targetCuts = 0;
    this.targetPieces = 0;
    this.pieces = [];
    
    // Звук для разреза
    this.sliceSound = new Audio('../../assets/hit_slash_20827.mp3');
    this.sliceSound.volume = 0.5;
    
    // Визуальные настройки
    this.polygonColor = '#ff357a';
    this.cutColor = '#fff172';
    this.currentCutColor = 'rgba(255, 241, 114, 0.6)';
    
    // Привязка событий
    this.setupEvents();
  }
  
  /**
   * Инициализация уровня
   */
  initLevel(sides, targetCuts, targetPieces) {
    this.targetCuts = targetCuts;
    this.targetPieces = targetPieces;
    this.cuts = [];
    this.pieces = [];
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
    
    this.polygon = generateConvexPolygon(sides, centerX, centerY, radius);
    this.pieces.push(this.polygon);
    
    this.redraw();
  }
  
  /**
   * Настройка обработчиков событий
   */
  setupEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    
    // Поддержка touch событий
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMouseDown(this.getTouchPos(touch));
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMouseMove(this.getTouchPos(touch));
    });
    
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.handleMouseUp(e);
    });
  }
  
  /**
   * Получение позиции мыши относительно canvas
   */
  getMousePos(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  
  /**
   * Получение позиции touch относительно canvas
   */
  getTouchPos(touch) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }
  
  /**
   * Начало рисования линии разреза
   */
  handleMouseDown(event) {
    const pos = event.clientX !== undefined ? this.getMousePos(event) : event;
    this.isDrawing = true;
    this.currentCut = [pos];
  }
  
  /**
   * Продолжение рисования линии
   */
  handleMouseMove(event) {
    if (!this.isDrawing) return;
    
    const pos = event.clientX !== undefined ? this.getMousePos(event) : event;
    
    // Добавляем точку только если она достаточно далеко от предыдущей
    const lastPoint = this.currentCut[this.currentCut.length - 1];
    if (distance(lastPoint, pos) > 5) {
      this.currentCut.push(pos);
      this.redraw();
    }
  }
  
  /**
   * Завершение рисования линии
   */
  handleMouseUp(event) {
    if (!this.isDrawing) return;
    
    this.isDrawing = false;
    
    // Проверяем, не превышен ли лимит разрезов
    if (this.cuts.length >= this.targetCuts) {
      this.currentCut = null;
      this.redraw();
      return;
    }
    
    if (this.isValidCut()) {
      this.cuts.push([...this.currentCut]);
      this.applyCut();
      
      this.sliceSound.currentTime = 0;
      this.sliceSound.play().catch(err => console.log('Audio play failed:', err));
    }
    
    this.currentCut = null;
    this.redraw();
  }
  
  /**
   * Проверка валидности разреза
   */
  isValidCut() {
    if (!this.currentCut || this.currentCut.length < 2) return false;
    
    // Проверяем, что разрез пересекает многоугольник
    const intersections = findPolygonIntersections(this.currentCut, this.polygon);
    
    // Должно быть ровно 2 пересечения (вход и выход)
    return intersections.length === 2;
  }
  
  /**
   * Применение разреза к фигуре
   */
  applyCut() {
    // Подсчитываем количество кусков по формуле:
    // Pieces = 1 + количество разрезов + количество пересечений между разрезами
    
    let intersectionCount = 0;
    
    // Проверяем пересечения нового разреза с существующими
    const currentCut = this.cuts[this.cuts.length - 1];
    
    for (let i = 0; i < this.cuts.length - 1; i++) {
      const existingCut = this.cuts[i];
      
      // Проверяем каждый сегмент текущего разреза с каждым сегментом существующего
      for (let j = 0; j < currentCut.length - 1; j++) {
        for (let k = 0; k < existingCut.length - 1; k++) {
          const intersection = lineIntersection(
            currentCut[j],
            currentCut[j + 1],
            existingCut[k],
            existingCut[k + 1]
          );
          
          if (intersection) {
            intersectionCount++;
          }
        }
      }
    }
    
    // Формула: количество кусков = 1 + n + c
    // где n - количество разрезов, c - количество пересечений между разрезами
    const totalPieces = 1 + this.cuts.length + intersectionCount;
    
    // Обновляем массив pieces (для отображения)
    this.pieces = Array(totalPieces).fill(null);
  }
  
  /**
   * Получение текущего прогресса
   */
  getProgress() {
    return {
      currentCuts: this.cuts.length,
      targetCuts: this.targetCuts,
      currentPieces: this.pieces.length,
      targetPieces: this.targetPieces,
      isComplete: this.cuts.length === this.targetCuts && this.pieces.length === this.targetPieces,
      isFailed: this.pieces.length > this.targetPieces || this.cuts.length > this.targetCuts
    };
  }
  
  /**
   * Отрисовка сцены
   */
  redraw() {
    const ctx = this.ctx;
    
    // Очистка canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Рисуем многоугольник
    this.drawPolygon(this.polygon, this.polygonColor);
    
    // Рисуем завершенные разрезы
    this.cuts.forEach(cut => {
      this.drawCut(cut, this.cutColor, 3);
    });
    
    // Рисуем текущий разрез
    if (this.currentCut && this.currentCut.length > 1) {
      this.drawCut(this.currentCut, this.currentCutColor, 4);
    }
    
    // Рисуем инструкцию    
    this.drawInstruction();
  }
  
  /**
   * Рисование многоугольника
   */
  drawPolygon(polygon, color) {
    const ctx = this.ctx;
    
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);
    
    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i].x, polygon[i].y);
    }
    
    ctx.closePath();
    
    // Заливка
    ctx.fillStyle = `${color}22`;
    ctx.fill();
    
    // Контур
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Рисуем вершины
    polygon.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
  }
  
  /**
   * Рисование линии разреза
   */
  drawCut(cut, color, width = 2) {
    const ctx = this.ctx;
    
    ctx.beginPath();
    ctx.moveTo(cut[0].x, cut[0].y);
    
    for (let i = 1; i < cut.length; i++) {
      ctx.lineTo(cut[i].x, cut[i].y);
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
  
  /**
   * Рисование инструкции
   */
  drawInstruction() {
    const ctx = this.ctx;
    const progress = this.getProgress();
    
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    
    // Изменяем цвет в зависимости от состояния
    if (progress.isFailed) {
      ctx.fillStyle = "#ff4444";
    } else if (progress.isComplete) {
      ctx.fillStyle = "#44ff44";
    } else {
      ctx.fillStyle = "#fff";
    }

    const text = `Разрезов: ${progress.currentCuts}/${progress.targetCuts} | Кусков: ${progress.currentPieces}/${progress.targetPieces}`;
    ctx.fillText(text, 20, 30);

    // Показываем подсказку о лимите
    if (progress.currentCuts >= progress.targetCuts && !progress.isComplete) {
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "#ffaa00";
      ctx.fillText("Достигнут лимит разрезов!", 20, 55);
    }
  }
  
  /**
   * Очистка игры
   */
  clear() {
    this.polygon = null;
    this.cuts = [];
    this.currentCut = null;
    this.pieces = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
