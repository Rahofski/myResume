import { questions } from "./questions.js";

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Перемешиваем вопросы
const shuffledQuestions = shuffle(questions);

// Состояние викторины
let currentQuestionIndex = 0;
let correctAnswers = 0;
let isAnswering = false;
let quizFinished = false;
const answeredQuestions = [];

// Элементы DOM
const questionTitle = document.querySelector(".questionTitle");
const returnButton = document.querySelector(".returnButton");
const questionBlock = document.querySelector(".questionBlock");
const answerBlock = document.querySelector(".answerBlock");
const resultBlock = document.querySelector(".resultBlock");

returnButton.addEventListener("click", () => {
  returnButton.classList.remove("show");
  if (quizFinished) {
    showQuestionList();
  }
});

function showCurrentQuestion() {
  if (currentQuestionIndex >= shuffledQuestions.length) {
    quizFinished = true;
    showResults();
    return;
  }

  const question = shuffledQuestions[currentQuestionIndex];
  questionTitle.textContent = `Вопрос ${currentQuestionIndex + 1} из ${shuffledQuestions.length}`;
  questionBlock.innerHTML = `<div class="current-question">${question.question}</div>`;
  answerBlock.innerHTML = "";
  resultBlock.innerHTML = "";

  const shuffledAnswers = shuffle(question.answers);

  shuffledAnswers.forEach((answer) => {
    const answerItem = document.createElement("div");
    answerItem.className = "answer-item";
    answerItem.textContent = answer.text;

    answerItem.addEventListener("click", () => {
      if (!isAnswering) {
        handleAnswer(answer, answerItem);
      }
    });

    answerBlock.appendChild(answerItem);
  });
}

// Показать результаты
function showResults() {
  questionTitle.textContent = "Вопросы закончились";
  questionBlock.innerHTML = "";
  answerBlock.innerHTML = "";
  resultBlock.innerHTML = `<div class="result-text">Правильных ответов: ${correctAnswers} из ${shuffledQuestions.length}</div>`;
  
  // Показываем список всех вопросов с результатами
  setTimeout(() => {
    showQuestionList();
  }, 2000);
}

function showQuestionList() {
  questionTitle.textContent = quizFinished ? "Результаты теста" : "Вопросы";
  questionBlock.innerHTML = "";
  answerBlock.innerHTML = "";
  
  if (!quizFinished) {
    resultBlock.innerHTML = "";
  } else {
    resultBlock.innerHTML = `<div class="result-text">Правильных ответов: ${correctAnswers} из ${shuffledQuestions.length}</div>`;
    resultBlock.style.display = "block";
  }

  shuffledQuestions.forEach((q, index) => {
    const questionItem = document.createElement("div");
    questionItem.className = `question-item${!answeredQuestions[index] ? " forbidden" : ""}`;
    questionItem.innerHTML = `
            <span class="question-number">${index + 1}.</span>
            <span class="question-text">${q.question}</span>
            ${answeredQuestions[index] ? `<span class="marker ${answeredQuestions[index].correct ? "correct" : "incorrect"}">${answeredQuestions[index].correct ? "✓" : "✗"}</span>` : ""}
        `;

    questionItem.addEventListener("click", () => {
      if (quizFinished && answeredQuestions[index]) {
        showCorrectAnswer(index);
      }
    });

    questionBlock.appendChild(questionItem);
  });
}

function handleAnswer(selectedAnswer, selectedElement) {
  isAnswering = true;

  selectedElement.classList.add("shake");

  setTimeout(() => {
    selectedElement.classList.remove("shake");

    if (selectedAnswer.isCorrect) {
      correctAnswers++;
      answeredQuestions[currentQuestionIndex] = { correct: true };

      const answerItems = answerBlock.querySelectorAll(".answer-item");
      answerItems.forEach((item) => {
        if (item !== selectedElement) {
          item.classList.add("slide-down");
        }
      });

      setTimeout(() => {
        selectedElement.classList.add("correct-answer");
        selectedElement.innerHTML = `
                    <div>${selectedAnswer.text}</div>
                    <div class="explanation">${selectedAnswer.explanation}</div>
                `;

        const currentQuestionDiv =
          questionBlock.querySelector(".current-question");
        currentQuestionDiv.innerHTML +=
          ' <span class="marker correct">✓</span>';

        setTimeout(() => {
          selectedElement.classList.add("slide-down");
          setTimeout(() => {
            isAnswering = false;
            currentQuestionIndex++;
            showCurrentQuestion();
          }, 600);
        }, 4000);
      }, 600);
    } else {
      answeredQuestions[currentQuestionIndex] = { correct: false };

      const currentQuestionDiv =
        questionBlock.querySelector(".current-question");
      currentQuestionDiv.innerHTML +=
        ' <span class="marker incorrect">✗</span>';

      const answerItems = answerBlock.querySelectorAll(".answer-item");
      answerItems.forEach((item) => {
        item.classList.add("slide-down");
      });

      setTimeout(() => {
        isAnswering = false;
        currentQuestionIndex++;
        showCurrentQuestion();
      }, 1500);
    }
  }, 500);
}

function showCorrectAnswer(index) {
  const question = shuffledQuestions[index];
  const correctAnswer = question.answers.find((a) => a.isCorrect);

  returnButton.classList.add("show");

  questionTitle.textContent = `Вопрос ${index + 1}`;
  questionBlock.innerHTML = `<div class="current-question">${question.question}</div>`;
  answerBlock.innerHTML = `
        <div class="answer-item correct-answer show-correct">
            <div>${correctAnswer.text}</div>
            <div class="explanation">${correctAnswer.explanation}</div>
        </div>
    `;
  resultBlock.style.display = "none";
}

showCurrentQuestion();
