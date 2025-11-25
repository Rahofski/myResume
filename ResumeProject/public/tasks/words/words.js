
const btn = document.getElementById('parseButton');
const input = document.getElementById('textInput');
const outputArea = document.getElementById('outputArea');
const block2 = document.querySelector('.block2');
const block3 = document.querySelector('.block3');
const block3Color = '#ebf1f3ff';

let words = [];
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function createAssociativeArray(wordsArr) {

  const sortedWords = {};
  
  const lowerCaseWords = [];
  const upperCaseWords = [];
  const numbers = [];
  
  wordsArr.forEach(word => {
    if (/^\d+$/.test(word)) {
      numbers.push(word);
    } else if (word[0] === word[0].toLowerCase()) {
      lowerCaseWords.push(word);
    } else {
      upperCaseWords.push(word);
    }
  });
  
  lowerCaseWords.sort((a, b) => a.localeCompare(b, 'ru'));
  upperCaseWords.sort((a, b) => a.localeCompare(b, 'ru'));
  numbers.sort((a, b) => parseInt(a) - parseInt(b));
  
  let aIndex = 1;
  lowerCaseWords.forEach(word => {
    sortedWords[`a${aIndex}`] = word;
    aIndex++;
  });
  
  let bIndex = 1;
  upperCaseWords.forEach(word => {
    sortedWords[`b${bIndex}`] = word;
    bIndex++;
  });
  
  let nIndex = 1;
  numbers.forEach(word => {
    sortedWords[`n${nIndex}`] = word;
    nIndex++;
  });

  return sortedWords;
}

function createWordElement(key, word, color) {
  const wordDiv = document.createElement('div');
  wordDiv.draggable = true;
  wordDiv.classList.add('word-item');
  wordDiv.textContent = `${key} ${word}`;
  wordDiv.style.backgroundColor = color;
  wordDiv.dataset.key = key;
  wordDiv.dataset.word = word;
  wordDiv.dataset.originalColor = color;
  
  wordDiv.addEventListener('dragstart', (e) => {
    draggedElement = e.target;
    const rect = e.target.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    e.target.style.opacity = '0.5';
  });
  
  wordDiv.addEventListener('dragend', (e) => {
    e.target.style.opacity = '1';
  });
  
  wordDiv.addEventListener('click', (e) => {
    if (e.target.parentElement === block3) {
      
      const textSpan = document.createElement('span');
      textSpan.textContent = e.target.dataset.word;
      textSpan.style.color = e.target.dataset.originalColor;
      outputArea.appendChild(textSpan);
    }
  });
  
  return wordDiv;
}

block2.addEventListener('dragover', (e) => {
  e.preventDefault();
});

block2.addEventListener('drop', (e) => {
  e.preventDefault();
  if (draggedElement && draggedElement.parentElement === block3) {
    const key = draggedElement.dataset.key;
    draggedElement.style.backgroundColor = draggedElement.dataset.originalColor;
    draggedElement.style.position = 'static';
    draggedElement.style.left = '';
    draggedElement.style.top = '';
    
    const items = Array.from(block2.children);
    let inserted = false;
    
    for (let item of items) {
      if (item.dataset.key > key) {
        block2.insertBefore(draggedElement, item);
        inserted = true;
        break;
      }
    }
    
    if (!inserted) {
      block2.appendChild(draggedElement);
    }
  }
});

block3.addEventListener('dragover', (e) => {
  e.preventDefault();
});

block3.addEventListener('drop', (e) => {
  e.preventDefault();
  if (draggedElement) {
    const rect = block3.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    
    const elementHeight = draggedElement.offsetHeight;
    if (y + elementHeight + 5 > rect.height) {
      return; 
    }
    
    const elements = block3.querySelectorAll('.word-item');
    let targetElement = null;
    
    for (let elem of elements) {
      if (elem === draggedElement) continue;
      const elemRect = elem.getBoundingClientRect();
      const elemX = elemRect.left - rect.left;
      const elemY = elemRect.top - rect.top;
      
      if (Math.abs(x - elemX) < 100 && Math.abs(y - elemY) < 40) {
        targetElement = elem;
        break;
      }
    }
    
    if (draggedElement.parentElement === block3 && targetElement) {
      const targetHeight = targetElement.offsetHeight;
      const newTargetY = parseFloat(draggedElement.style.top);
      if (newTargetY + targetHeight + 5 > rect.height) {
        return; 
      }
      
      const tempLeft = draggedElement.style.left;
      const tempTop = draggedElement.style.top;
      
      draggedElement.style.left = targetElement.style.left;
      draggedElement.style.top = targetElement.style.top;
      
      targetElement.style.left = tempLeft;
      targetElement.style.top = tempTop;
    } 
    // Из блока 2 в блок 3
    else if (draggedElement.parentElement !== block3 && !targetElement) {
      draggedElement.style.backgroundColor = block3Color;
      draggedElement.style.position = 'absolute';
      draggedElement.style.left = x + 'px';
      draggedElement.style.top = y + 'px';
      block3.appendChild(draggedElement);
    }
    // Перетаскиваем нутри блока 3
    else if (draggedElement.parentElement === block3 && !targetElement) {
      draggedElement.style.left = x + 'px';
      draggedElement.style.top = y + 'px';
    }
  }
});

btn.addEventListener('click', () => {
  block2.innerHTML = '';
  block3.innerHTML = '';
  outputArea.innerHTML = '';
  const text = input.value;
  words = text.split('-').map(word => word.trim()).filter(word => word.length > 0);

  const sortedWords = createAssociativeArray(words);

  for (let key in sortedWords) {
    const color = getRandomColor();
    const wordDiv = createWordElement(key, sortedWords[key], color);
    block2.appendChild(wordDiv);
  }
});

