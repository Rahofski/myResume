// Функциональные выражения для формул
const func1 = function (a, b, c) {
  return (Math.PI * Math.sqrt(a)) / (b * b * c);
};

const func2 = function (a, b, c) {
  return Math.pow(a + Math.sqrt(b), 2) / Math.pow(c, 3);
};

const func3 = function (a, b, c) {
  return Math.sqrt(a + b + Math.sqrt(c)) / (Math.PI * b);
};

const formulas = [func1, func2, func3];

function getInputValues(formulaNumber) {
  const a = parseFloat(
    prompt(`Формула ${formulaNumber}: Введите значение переменной a:`)
  );
  const b = parseFloat(
    prompt(`Формула ${formulaNumber}: Введите значение переменной b:`)
  );
  const c = parseFloat(
    prompt(`Формула ${formulaNumber}: Введите значение переменной c:`)
  );

  return { a, b, c };
}

function isValidResult(result) {
  return (
    !isNaN(result) &&
    isFinite(result) &&
    result !== undefined &&
    result !== null
  );
}

function displayFormulaResult(formulaNumber, inputs, result, isSuccess) {
  const resultsContainer = document.getElementById("results-container");

  const resultDiv = document.createElement("div");
  resultDiv.className = "formula-result";

  const formulaImg = document.createElement("img");
  formulaImg.src = `assets/formula_${formulaNumber}.JPG`;
  formulaImg.alt = `Формула ${formulaNumber}`;
  formulaImg.className = "formula-image";

  const inputText = document.createElement("p");
  inputText.innerHTML = `<strong>Входные данные:</strong> a = ${inputs.a}, b = ${inputs.b}, c = ${inputs.c}`;

  const resultText = document.createElement("p");
  resultText.className = "result-text";
  if (isSuccess) {
    resultText.innerHTML = `<strong>Результат:</strong> ${result.toFixed(4)}`;
    resultText.style.color = "green";
  } else {
    resultText.innerHTML = `<strong>Ошибка:</strong> Невозможно вычислить результат`;
    resultText.style.color = "red";
  }

  // Добавляем смайлик
  const smileImg = document.createElement("img");
  smileImg.className = "smile-image";
  if (isSuccess) {
    smileImg.src = "assets/sm_1.png";
    smileImg.alt = "Веселый смайлик";
  } else {
    smileImg.src = "assets/sm_2.png";
    smileImg.alt = "Грустный смайлик";
  }

  // Собираем все элементы вместе
  resultDiv.appendChild(formulaImg);
  resultDiv.appendChild(inputText);
  resultDiv.appendChild(resultText);
  resultDiv.appendChild(smileImg);

  resultsContainer.appendChild(resultDiv);
}

function processFormulas() {
  const formulaCount = parseInt(document.getElementById("formula-count").value);

  if (!formulaCount || formulaCount < 1 || formulaCount > 3) {
    alert("Пожалуйста, введите число от 1 до 3");
    return;
  }

  document.getElementById("results-container").innerHTML = "";

  let i = 0;

  function processNext() {
    const formulaNumber = i + 1;
    const inputs = getInputValues(formulaNumber);

    let result = formulas[i](inputs.a, inputs.b, inputs.c);
    let isSuccess = isValidResult(result);

    if (!isSuccess) result = null;

    displayFormulaResult(formulaNumber, inputs, result, isSuccess);

    if (i < formulaCount - 1) {
      setTimeout(() => {
        const cont = confirm("Продолжаем дальше или нет?");
        if (cont) {
          i++;
          processNext();
        }
      }, 500);
    }
  }

  setTimeout(() => {
    processNext();
  }, 100);
}

document.addEventListener("DOMContentLoaded", function () {
  const generateButton = document.getElementById("generate-formulas");
  generateButton.addEventListener("click", processFormulas);

  const formulaCountInput = document.getElementById("formula-count");
  formulaCountInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      processFormulas();
    }
  });
});
