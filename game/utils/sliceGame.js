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
    this.ctx = canvas.getContext("2d");

    this.polygon = null;
    this.cuts = [];
    this.currentCut = null;
    this.isDrawing = false;
    this.targetCuts = 0;
    this.targetPieces = 0;
    this.pieces = [];

    // Параметры для анимации движения (с уровня 4)
    this.isMoving = false;
    this.velocity = { x: 0, y: 0 };
    this.animationFrame = null;
    this.polygonCenter = { x: 0, y: 0 };
    this.currentLevel = 1;

    // Звук для разреза
    this.sliceSound = new Audio("../../assets/hit_slash_20827.mp3");
    this.sliceSound.volume = 0.5;

    // Визуальные настройки
    this.polygonColor = "#ff357a";
    this.cutColor = "#fff172";
    this.currentCutColor = "rgba(255, 241, 114, 0.6)";

    // Привязка событий
    this.setupEvents();
  }

  /**
   * Инициализация уровня
   */
  initLevel(sides, targetCuts, targetPieces, level = 1) {
    this.targetCuts = targetCuts;
    this.targetPieces = targetPieces;
    this.cuts = [];
    this.pieces = [];
    this.currentLevel = level;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    // Радиус адаптивный - 25% от меньшей стороны canvas
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.25;

    this.polygon = generateConvexPolygon(sides, centerX, centerY, radius);
    this.polygonCenter = { x: centerX, y: centerY };
    this.pieces.push(this.polygon);

    // Запускаем анимацию движения с 4 уровня
    if (level >= 4) {
      this.startMoving();
    } else {
      this.stopMoving();
    }

    this.redraw();
  }

  /**
   * Запуск движения фигуры
   */
  startMoving() {
    this.isMoving = true;

    const baseSpeed = 1 + (this.currentLevel - 4) * 2;
    const angle = Math.random() * Math.PI * 2;

    this.velocity = {
      x: Math.cos(angle) * baseSpeed,
      y: Math.sin(angle) * baseSpeed,
    };

    this.animate();
  }

  /**
   * Остановка движения фигуры
   */
  stopMoving() {
    this.isMoving = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Анимация движения
   */
  animate() {
    if (!this.isMoving) return;

    this.updatePosition();
    this.redraw();

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Обновление позиции фигуры
   */
  updatePosition() {
    // Сохраняем предыдущую позицию центра
    const prevCenterX = this.polygonCenter.x;
    const prevCenterY = this.polygonCenter.y;

    // Двигаем центр
    this.polygonCenter.x += this.velocity.x;
    this.polygonCenter.y += this.velocity.y;

    // Вычисляем границы фигуры (находим min/max координаты вершин)
    const bounds = this.getPolygonBounds();
    const padding = 20; // Отступ от краев canvas

    // Проверяем столкновение с левым краем
    if (bounds.minX + this.velocity.x < padding) {
      this.velocity.x = Math.abs(this.velocity.x);
      this.polygonCenter.x = prevCenterX + this.velocity.x;
    }
    // Проверяем столкновение с правым краем
    else if (bounds.maxX + this.velocity.x > this.canvas.width - padding) {
      this.velocity.x = -Math.abs(this.velocity.x);
      this.polygonCenter.x = prevCenterX + this.velocity.x;
    }

    // Проверяем столкновение с верхним краем
    if (bounds.minY + this.velocity.y < padding) {
      this.velocity.y = Math.abs(this.velocity.y);
      this.polygonCenter.y = prevCenterY + this.velocity.y;
    }
    // Проверяем столкновение с нижним краем
    else if (bounds.maxY + this.velocity.y > this.canvas.height - padding) {
      this.velocity.y = -Math.abs(this.velocity.y);
      this.polygonCenter.y = prevCenterY + this.velocity.y;
    }

    // Вычисляем смещение
    const deltaX = this.polygonCenter.x - prevCenterX;
    const deltaY = this.polygonCenter.y - prevCenterY;

    // Сдвигаем все вершины полигона на то же смещение (без пересоздания формы)
    this.polygon = this.polygon.map((point) => ({
      x: point.x + deltaX,
      y: point.y + deltaY,
    }));
  }

  /**
   * Получение границ полигона
   */
  getPolygonBounds() {
    if (!this.polygon || this.polygon.length === 0) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }

    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;

    for (const point of this.polygon) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }

    return { minX, maxX, minY, maxY };
  }

  /**
   * Обновление размера canvas (при resize окна)
   */
  updateCanvasSize(width, height) {
    // Если фигура уже существует, масштабируем её позицию
    if (this.polygon && this.polygon.length > 0) {
      const oldCenterX = this.polygonCenter.x;
      const oldCenterY = this.polygonCenter.y;

      // Новый центр пропорционален новому размеру
      const newCenterX = width / 2;
      const newCenterY = height / 2;

      // Смещаем полигон к новому центру
      const deltaX = newCenterX - oldCenterX;
      const deltaY = newCenterY - oldCenterY;

      this.polygon = this.polygon.map((point) => ({
        x: point.x + deltaX,
        y: point.y + deltaY,
      }));

      this.polygonCenter = { x: newCenterX, y: newCenterY };

      // Также обновляем радиус фигуры если нужно
      const newRadius = Math.min(width, height) * 0.3;
      // Масштабирование можно добавить при необходимости
    }

    this.redraw();
  }

  /**
   * Настройка обработчиков событий
   */
  setupEvents() {
    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));

    // Поддержка touch событий
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMouseDown(this.getTouchPos(touch));
    });

    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMouseMove(this.getTouchPos(touch));
    });

    this.canvas.addEventListener("touchend", (e) => {
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
      y: event.clientY - rect.top,
    };
  }

  /**
   * Получение позиции touch относительно canvas
   */
  getTouchPos(touch) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  /**
   * Начало рисования линии разреза
   */
  handleMouseDown(event) {
    const pos = event.clientX !== undefined ? this.getMousePos(event) : event;
    this.isDrawing = true;

    // Сохраняем смещение относительно центра фигуры (для движущейся фигуры)
    this.currentCut = [
      {
        x: pos.x,
        y: pos.y,
        offsetX: pos.x - this.polygonCenter.x,
        offsetY: pos.y - this.polygonCenter.y,
      },
    ];
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
      this.currentCut.push({
        x: pos.x,
        y: pos.y,
        offsetX: pos.x - this.polygonCenter.x,
        offsetY: pos.y - this.polygonCenter.y,
      });
      // Не вызываем redraw здесь, если фигура движется - это делает animate()
      if (!this.isMoving) {
        this.redraw();
      }
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
      this.sliceSound
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }

    this.currentCut = null;
    if (!this.isMoving) {
      this.redraw();
    }
  }

  /**
   * Проверка валидности разреза
   */
  isValidCut() {
    if (!this.currentCut || this.currentCut.length < 2) return false;

    const cutPoints = this.currentCut.map((p) => ({ x: p.x, y: p.y }));

    // Проверяем, что разрез пересекает многоугольник
    const intersections = findPolygonIntersections(cutPoints, this.polygon);

    // Должно быть ровно 2 пересечения (вход и выход)
    return intersections.length === 2;
  }

  /**
   * Применение разреза к фигуре
   */
  applyCut() {
    let intersectionCount = 0;

    const currentCut = this.cuts[this.cuts.length - 1];

    for (let i = 0; i < this.cuts.length - 1; i++) {
      const existingCut = this.cuts[i];

      const currentCutCoords = this.getCutActualCoordinates(currentCut);
      const existingCutCoords = this.getCutActualCoordinates(existingCut);

      for (let j = 0; j < currentCutCoords.length - 1; j++) {
        for (let k = 0; k < existingCutCoords.length - 1; k++) {
          const intersection = lineIntersection(
            currentCutCoords[j],
            currentCutCoords[j + 1],
            existingCutCoords[k],
            existingCutCoords[k + 1]
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

    this.pieces = Array(totalPieces).fill(null);
  }

  /**
   * Получает актуальные координаты разреза с учетом движения фигуры
   */
  getCutActualCoordinates(cut) {
    if (cut[0].offsetX !== undefined && this.isMoving) {
      return cut.map((p) => ({
        x: this.polygonCenter.x + p.offsetX,
        y: this.polygonCenter.y + p.offsetY,
      }));
    }
    return cut;
  }

  /**
   * Получение текущего прогресса
   */
  getProgress() {
    const currentCuts = this.cuts.length;
    const currentPieces = this.pieces.length;

    // Уровень провален если:
    // 1. Превышен лимит кусков
    // 2. Превышен лимит разрезов
    // 3. Использованы все разрезы, но кусков недостаточно или слишком много
    const isFailed =
      currentPieces > this.targetPieces ||
      currentCuts > this.targetCuts ||
      (currentCuts === this.targetCuts && currentPieces !== this.targetPieces);

    return {
      currentCuts: currentCuts,
      targetCuts: this.targetCuts,
      currentPieces: currentPieces,
      targetPieces: this.targetPieces,
      isComplete:
        currentCuts === this.targetCuts && currentPieces === this.targetPieces,
      isFailed: isFailed,
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
    this.cuts.forEach((cut) => {
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
    polygon.forEach((point) => {
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

    // Если разрез имеет смещения (для движущейся фигуры), пересчитываем позиции
    if (cut[0].offsetX !== undefined && this.isMoving) {
      const x = this.polygonCenter.x + cut[0].offsetX;
      const y = this.polygonCenter.y + cut[0].offsetY;
      ctx.moveTo(x, y);

      for (let i = 1; i < cut.length; i++) {
        const px = this.polygonCenter.x + cut[i].offsetX;
        const py = this.polygonCenter.y + cut[i].offsetY;
        ctx.lineTo(px, py);
      }
    } else {
      // Обычная отрисовка для неподвижной фигуры
      ctx.moveTo(cut[0].x, cut[0].y);

      for (let i = 1; i < cut.length; i++) {
        ctx.lineTo(cut[i].x, cut[i].y);
      }
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  /**
   * Рисование инструкции
   */
  drawInstruction() {
    const ctx = this.ctx;
    const progress = this.getProgress();

    ctx.font = "bold 16px Arial";
    ctx.textAlign = "left";

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
    this.stopMoving();
    this.polygon = null;
    this.cuts = [];
    this.currentCut = null;
    this.pieces = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
