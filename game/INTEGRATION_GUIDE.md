# 🎮 Инструкция по добавлению игровой логики

## Что уже готово

✅ Вся инфраструктура приложения  
✅ Система авторизации  
✅ Управление состоянием игры  
✅ Таймеры и подсчет очков  
✅ Сохранение в localStorage  
✅ Рейтинг игроков  
✅ Все страницы и навигация  

## Что нужно добавить (в зависимости от темы игры)

### 1. Наполнить data.js

Добавьте ваши игровые данные (вопросы, элементы, объекты и т.д.)

```javascript
// Пример для игры с вопросами
export const questions = [
  {
    id: 1,
    text: "Ваш вопрос?",
    correctAnswer: "Правильный ответ",
    options: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"]
  },
  // ... минимум 15 вопросов (по 5 на уровень)
];
```

### 2. Реализовать loadLevelContent() в game.js

Найдите функцию `loadLevelContent(level)` в файле `pages/game/game.js` (строка ~197)

Замените заглушку на вашу игровую логику:

```javascript
function loadLevelContent(level) {
  gameContentElement.innerHTML = ''; // Очистить
  
  // Ваш код для отображения игрового контента
  // Например:
  // - Создать кнопки с вариантами ответов
  // - Добавить drag-and-drop элементы
  // - Разместить интерактивные объекты
  
  loadQuestion(0); // Загрузить первый вопрос
}
```

### 3. Реализовать loadQuestion() в game.js

```javascript
function loadQuestion(questionIndex) {
  // Получить вопрос из data.js
  // Отобразить его в gameContentElement
  // Создать интерактивные элементы
  
  // При правильном ответе вызвать:
  handleCorrectAnswer(timeSpent);
  
  // При неправильном:
  handleWrongAnswer();
}
```

### 4. Добавить события

В зависимости от требований, добавьте:

- **Drag and Drop**: `ondragstart`, `ondragover`, `ondrop`
- **Контекстное меню**: `oncontextmenu`
- **Наведение**: `onmouseover`, `onmouseout`
- **Клавиши**: уже реализовано для ESC и Enter

### 5. Добавить анимации в game.css

```css
/* Примеры анимаций для игровых элементов */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.game-element {
  animation: bounce 1s infinite;
}
```

## Примеры различных типов игр

### Игра с выбором ответов

```javascript
function loadQuestion(index) {
  const question = questions[index];
  
  gameContentElement.innerHTML = `
    <div class="question-block">
      <h3>${question.text}</h3>
      <div class="options">
        ${question.options.map((opt, i) => 
          `<button class="option-btn" data-answer="${opt}">${opt}</button>`
        ).join('')}
      </div>
    </div>
  `;
  
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const answer = e.target.dataset.answer;
      if (answer === question.correctAnswer) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    });
  });
}
```

### Игра с Drag and Drop

```javascript
function loadQuestion(index) {
  gameContentElement.innerHTML = `
    <div class="drag-container">
      <div class="draggables">
        ${items.map(item => 
          `<div class="draggable" draggable="true" data-id="${item.id}">
            ${item.name}
          </div>`
        ).join('')}
      </div>
      <div class="drop-zones">
        ${zones.map(zone => 
          `<div class="drop-zone" data-zone="${zone.id}">
            ${zone.name}
          </div>`
        ).join('')}
      </div>
    </div>
  `;
  
  // Добавить обработчики drag and drop
  setupDragAndDrop();
}
```

### Игра с кликами по движущимся объектам

```javascript
function loadQuestion(index) {
  gameContentElement.innerHTML = '<div class="game-field"></div>';
  
  // Создать несколько объектов
  for (let i = 0; i < 5; i++) {
    const element = document.createElement('div');
    element.className = 'moving-element';
    element.style.left = Math.random() * 100 + '%';
    element.style.animation = `fall ${3 + Math.random() * 2}s linear infinite`;
    
    element.addEventListener('click', () => {
      if (element.dataset.correct === 'true') {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
      element.remove();
    });
    
    gameContentElement.querySelector('.game-field').appendChild(element);
  }
}
```

## Важные функции для использования

### Из gameState.js

```javascript
import gameState from '../../utils/gameState.js';

// Текущий уровень
gameState.currentLevel

// Добавить очки за правильный ответ
gameState.addCorrectAnswer(timeSpent);

// Вычесть за неправильный
gameState.addWrongAnswer();

// Проверить завершен ли уровень
gameState.isLevelComplete()

// Получить статистику
gameState.getStats()
```

### Из helpers.js

```javascript
import { shuffleArray, getRandomElements } from '../../utils/helpers.js';

// Перемешать массив
const shuffled = shuffleArray(myArray);

// Получить N случайных элементов
const random = getRandomElements(myArray, 5);
```

## Тестирование

1. Откройте `index.html` в браузере
2. Пройдите авторизацию
3. Проверьте работу таймера
4. Проверьте начисление очков
5. Проверьте переходы между уровнями
6. Проверьте сохранение результатов
7. Проверьте рейтинг

## Отладка

- Откройте Console в DevTools (F12)
- Все ошибки будут отображены там
- Используйте `console.log()` для проверки значений
- Проверьте localStorage: Application → Local Storage

## Следующие шаги

1. Определите тему игры
2. Создайте игровые данные в `data.js`
3. Реализуйте `loadLevelContent()` и `loadQuestion()`
4. Добавьте специфические события
5. Протестируйте все уровни
6. Добавьте финальные штрихи (звуки, дополнительные анимации)
7. Подготовьте к загрузке на хостинг

Удачи! 🚀
