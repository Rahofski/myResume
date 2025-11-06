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
  showAllQuestions();
});

function showAllQuestions() {
  questionBlock.innerHTML = "";

  if (quizFinished) {
    questionTitle.textContent = "Результаты теста";
    resultBlock.innerHTML = `<div class="result-text">Правильных ответов: ${correctAnswers} из ${shuffledQuestions.length}</div>`;
    resultBlock.style.display = "block";
  } else {
    questionTitle.textContent = `Вопрос ${currentQuestionIndex + 1} из ${shuffledQuestions.length}`;
    resultBlock.innerHTML = "";
    resultBlock.style.display = "";
    answerBlock.innerHTML = "";
  }

  shuffledQuestions.forEach((q, index) => {
    if (!quizFinished && index > currentQuestionIndex) {
      return;
    }

    const questionItem = document.createElement("div");
    const isAnswered = answeredQuestions[index] !== undefined;
    const marker = isAnswered
      ? `<span class="marker ${answeredQuestions[index].correct ? "correct" : "incorrect"}">${answeredQuestions[index].correct ? "✓" : "✗"}</span>`
      : "";

    questionItem.className = `question-item${!quizFinished && isAnswered ? " forbidden" : ""}`;
    questionItem.innerHTML = `
      <span class="question-number">${index + 1}.</span>
      <span class="question-text">${q.question}</span>
      ${marker}
    `;

    if (!quizFinished && !isAnswered && !isAnswering) {
      questionItem.addEventListener("click", () => {
        showAnswers(index);
      });
    }

    if (quizFinished && isAnswered) {
      questionItem.addEventListener("click", () => {
        showCorrectAnswer(index);
      });
    }

    questionBlock.appendChild(questionItem);
  });
}

function showAnswers(index) {
  if (isAnswering || answeredQuestions[index] !== undefined) return;

  const question = shuffledQuestions[index];
  answerBlock.innerHTML = "";

  const shuffledAnswers = shuffle(question.answers);

  shuffledAnswers.forEach((answer) => {
    const answerItem = document.createElement("div");
    answerItem.className = "answer-item";
    answerItem.textContent = answer.text;

    answerItem.addEventListener("click", () => {
      if (!isAnswering) {
        handleAnswer(answer, answerItem, index);
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

  setTimeout(() => {
    showAllQuestions();
  }, 2000);
}

function handleAnswer(selectedAnswer, selectedElement, questionIndex) {
  isAnswering = true;

  selectedElement.classList.add("shake");

  setTimeout(() => {
    selectedElement.classList.remove("shake");

    if (selectedAnswer.isCorrect) {
      correctAnswers++;
      answeredQuestions[questionIndex] = { correct: true };

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

        // Обновляем вопрос в списке
        const questionItems = questionBlock.querySelectorAll(".question-item");
        if (questionItems[questionIndex]) {
          const marker = document.createElement("span");
          marker.className = "marker correct";
          marker.textContent = "✓";
          questionItems[questionIndex].appendChild(marker);
          questionItems[questionIndex].classList.add("forbidden");
        }

        setTimeout(() => {
          selectedElement.classList.add("slide-down");
          setTimeout(() => {
            isAnswering = false;
            currentQuestionIndex++;

            if (currentQuestionIndex >= shuffledQuestions.length) {
              quizFinished = true;
              showResults();
            } else {
              showAllQuestions();
            }
          }, 600);
        }, 4000);
      }, 600);
    } else {
      answeredQuestions[questionIndex] = { correct: false };

      // Обновляем вопрос в списке
      const questionItems = questionBlock.querySelectorAll(".question-item");
      if (questionItems[questionIndex]) {
        const marker = document.createElement("span");
        marker.className = "marker incorrect";
        marker.textContent = "✗";
        questionItems[questionIndex].appendChild(marker);
        questionItems[questionIndex].classList.add("forbidden");
      }

      const answerItems = answerBlock.querySelectorAll(".answer-item");
      answerItems.forEach((item) => {
        item.classList.add("slide-down");
      });

      setTimeout(() => {
        isAnswering = false;
        currentQuestionIndex++;

        if (currentQuestionIndex >= shuffledQuestions.length) {
          quizFinished = true;
          showResults();
        } else {
          showAllQuestions();
        }
      }, 1500);
    }
  }, 500);
}

function showCorrectAnswer(index) {
  const question = shuffledQuestions[index];
  const correctAnswer = question.answers.find((a) => a.isCorrect);

  returnButton.classList.remove("show");

  answerBlock.innerHTML = `
    <div class="answer-item correct-answer show-correct">
      <div class="answer-question">${question.question}</div>
      <div>${correctAnswer.text}</div>
      <div class="explanation">${correctAnswer.explanation}</div>
    </div>
  `;
}

showAllQuestions();
