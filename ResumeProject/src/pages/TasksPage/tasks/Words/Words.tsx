import React, { useState, useRef } from 'react';
import styles from './Words.module.css';

interface SortedWords {
  [key: string]: string;
}

interface WordElement {
  key: string;
  word: string;
  color: string;
  position?: { x: number; y: number };
}

const Words: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [block2Words, setBlock2Words] = useState<WordElement[]>([]);
  const [block3Words, setBlock3Words] = useState<WordElement[]>([]);
  const [outputText, setOutputText] = useState<Array<{ word: string; color: string }>>([]);
  const [draggedWord, setDraggedWord] = useState<WordElement | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const block3Ref = useRef<HTMLDivElement>(null);

  const getRandomColor = (): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const createAssociativeArray = (wordsArr: string[]): SortedWords => {
    const sortedWords: SortedWords = {};
    const lowerCaseWords: string[] = [];
    const upperCaseWords: string[] = [];
    const numbers: string[] = [];

    wordsArr.forEach((word) => {
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
    lowerCaseWords.forEach((word) => {
      sortedWords[`a${aIndex}`] = word;
      aIndex++;
    });

    let bIndex = 1;
    upperCaseWords.forEach((word) => {
      sortedWords[`b${bIndex}`] = word;
      bIndex++;
    });

    let nIndex = 1;
    numbers.forEach((word) => {
      sortedWords[`n${nIndex}`] = word;
      nIndex++;
    });

    return sortedWords;
  };

  const handleParse = () => {
    setBlock2Words([]);
    setBlock3Words([]);
    setOutputText([]);

    const words = inputText
      .split('-')
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    const sortedWords = createAssociativeArray(words);
    const wordElements: WordElement[] = [];

    for (const key in sortedWords) {
      const color = getRandomColor();
      wordElements.push({
        key,
        word: sortedWords[key],
        color,
      });
    }

    setBlock2Words(wordElements);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    word: WordElement
  ) => {
    setDraggedWord(word);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleBlock2Drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedWord) return;

    const isFromBlock3 = block3Words.some((w) => w.key === draggedWord.key);
    if (isFromBlock3) {
      setBlock3Words(block3Words.filter((w) => w.key !== draggedWord.key));
      
      const newBlock2Words = [...block2Words, { ...draggedWord, position: undefined }];
      newBlock2Words.sort((a, b) => a.key.localeCompare(b.key));
      setBlock2Words(newBlock2Words);
    }

    setDraggedWord(null);
  };

  const handleBlock3Drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedWord || !block3Ref.current) return;

    const rect = block3Ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    const isFromBlock3 = block3Words.some((w) => w.key === draggedWord.key);

    if (y + 50 > rect.height) {
      setDraggedWord(null);
      return;
    }

    if (isFromBlock3) {
      const targetWord = block3Words.find((w) => {
        if (w.key === draggedWord.key || !w.position) return false;
        const dx = Math.abs(x - w.position.x);
        const dy = Math.abs(y - w.position.y);
        return dx < 100 && dy < 40;
      });

      if (targetWord && targetWord.position) {
        const newY = draggedWord.position!.y;
        if (newY + 50 > rect.height) {
          setDraggedWord(null);
          return;
        }

        const updatedWords = block3Words.map((w) => {
          if (w.key === draggedWord.key) {
            return { ...w, position: targetWord.position };
          } else if (w.key === targetWord.key) {
            return { ...w, position: draggedWord.position };
          }
          return w;
        });
        setBlock3Words(updatedWords);
      } else {
        const updatedWords = block3Words.map((w) =>
          w.key === draggedWord.key ? { ...w, position: { x, y } } : w
        );
        setBlock3Words(updatedWords);
      }
    } else {
      setBlock2Words(block2Words.filter((w) => w.key !== draggedWord.key));
      setBlock3Words([
        ...block3Words,
        { ...draggedWord, position: { x, y } },
      ]);
    }

    setDraggedWord(null);
  };

  const handleWordClick = (word: WordElement, isInBlock3: boolean) => {
    if (isInBlock3) {
      setOutputText([...outputText, { word: word.word, color: word.color }]);
    }
  };

  return (
    <div className={styles.wordsContainer}>
      <div
        className={styles.block3}
        ref={block3Ref}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleBlock3Drop}
      >
        {block3Words.map((word) => (
          <div
            key={word.key}
            className={styles.wordItem}
            draggable
            onDragStart={(e) => handleDragStart(e, word)}
            onDragEnd={handleDragEnd}
            onClick={() => handleWordClick(word, true)}
            style={{
              backgroundColor: '#ebf1f3ff',
              position: 'absolute',
              left: word.position?.x ?? 0,
              top: word.position?.y ?? 0,
            }}
          >
            {word.key} {word.word}
          </div>
        ))}
      </div>

      <div className={styles.block12}>
        <div
          className={styles.block2}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleBlock2Drop}
        >
          {block2Words.map((word) => (
            <div
              key={word.key}
              className={styles.wordItem}
              draggable
              onDragStart={(e) => handleDragStart(e, word)}
              onDragEnd={handleDragEnd}
              onClick={() => handleWordClick(word, false)}
              style={{
                backgroundColor: word.color,
              }}
            >
              {word.key} {word.word}
            </div>
          ))}
        </div>

        <div className={styles.block1}>
          <div className={styles.inputArea}>
            <input
              type="text"
              id="textInput"
              className={styles.textInput}
              placeholder="Введите слова, разделяя их тире"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button className={styles.parseButton} onClick={handleParse}>
              Разобрать
            </button>
          </div>
          <div className={styles.outputArea}>
            {outputText.map((item, index) => (
              <span key={index} style={{ color: item.color }}>
                {item.word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Words;
