
/**
 * Генерирует выпуклый многоугольник методом полярных координат
 * @param {number} sides - количество сторон (от 3 до 10)
 * @param {number} centerX - координата X центра
 * @param {number} centerY - координата Y центра
 * @param {number} radius - базовый радиус
 * @returns {Array} массив точек [{x, y}, ...]
 */
export function generateConvexPolygon(sides, centerX, centerY, radius) {
  const points = [];
  const angleStep = (2 * Math.PI) / sides;
  
  const radii = [];
  for (let i = 0; i < sides; i++) {
    radii.push(radius * (0.6 + Math.random() * 0.35));
  }
  
  for (let i = 0; i < sides; i++) {
    const baseAngle = i * angleStep;
    const angleOffset = (Math.random() - 0.5) * angleStep * 0.3; // ±15% от шага
    const angle = baseAngle + angleOffset;
    
    points.push({
      x: centerX + radii[i] * Math.cos(angle),
      y: centerY + radii[i] * Math.sin(angle)
    });
  }
  
  return points;
}

/**
 * Проверяет, находится ли точка внутри многоугольника (Ray casting algorithm)
 * @param {Object} point - точка {x, y}
 * @param {Array} polygon - массив точек многоугольника
 * @returns {boolean}
 */
export function isPointInPolygon(point, polygon) {
  let inside = false;
  const x = point.x;
  const y = point.y;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    
    const intersect = ((yi > y) !== (yj > y)) &&
                     (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Находит точку пересечения двух отрезков
 * @param {Object} p1 - начало первого отрезка
 * @param {Object} p2 - конец первого отрезка
 * @param {Object} p3 - начало второго отрезка
 * @param {Object} p4 - конец второго отрезка
 * @returns {Object|null} точка пересечения или null
 */
export function lineIntersection(p1, p2, p3, p4) {
  const x1 = p1.x, y1 = p1.y;
  const x2 = p2.x, y2 = p2.y;
  const x3 = p3.x, y3 = p3.y;
  const x4 = p4.x, y4 = p4.y;
  
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  
  if (Math.abs(denom) < 0.0001) return null; // Параллельны
  
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  
  // Проверяем, что пересечение внутри отрезков
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    };
  }
  
  return null;
}

/**
 * Находит все пересечения линии с гранями многоугольника
 * @param {Array} line - массив точек линии разреза
 * @param {Array} polygon - массив точек многоугольника
 * @returns {Array} массив точек пересечения с индексами граней
 */
export function findPolygonIntersections(line, polygon) {
  const intersections = [];
  
  // Проверяем каждую грань многоугольника
  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];
    
    // Проверяем каждый сегмент линии разреза
    for (let j = 0; j < line.length - 1; j++) {
      const intersection = lineIntersection(line[j], line[j + 1], p1, p2);
      
      if (intersection) {
        intersections.push({
          point: intersection,
          edgeIndex: i
        });
      }
    }
  }
  
  return intersections;
}

/**
 * Вычисляет расстояние между двумя точками
 * @param {Object} p1 - первая точка
 * @param {Object} p2 - вторая точка
 * @returns {number} расстояние
 */
export function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Вычисляет площадь многоугольника
 * @param {Array} polygon - массив точек
 * @returns {number} площадь
 */
export function polygonArea(polygon) {
  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i].x * polygon[j].y;
    area -= polygon[j].x * polygon[i].y;
  }
  return Math.abs(area / 2);
}

/**
 * Проверяет, является ли многоугольник выпуклым
 * @param {Array} polygon - массив точек
 * @returns {boolean}
 */
export function isConvex(polygon) {
  if (polygon.length < 3) return false;
  
  let sign = null;
  const n = polygon.length;
  
  for (let i = 0; i < n; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % n];
    const p3 = polygon[(i + 2) % n];
    
    const cross = (p2.x - p1.x) * (p3.y - p2.y) - (p2.y - p1.y) * (p3.x - p2.x);
    
    if (Math.abs(cross) > 0.001) {
      const currentSign = cross > 0;
      if (sign === null) {
        sign = currentSign;
      } else if (sign !== currentSign) {
        return false;
      }
    }
  }
  
  return true;
}
