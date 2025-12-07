import { generateNickname } from "../../utils/helpers.js";
import {
  saveCurrentPlayer,
  registerUser,
  loginUser,
} from "../../utils/storage.js";

const generateNickButton = document.getElementById("generate-nick-btn");
const nickInput = document.getElementById("nickInput");
const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const confirmPasswordBox = document.getElementById("confirmPasswordBox");
const submitBtn = document.getElementById("submit-btn");
const submitBtnInput = document.getElementById("submitBtnInput");
const formTitle = document.getElementById("form-title");
const toggleFormBtn = document.getElementById("toggle-form-btn");

let isRegistrationMode = true;

generateNickButton.addEventListener("click", () => {
  const randomNick = generateNickname();
  nickInput.value = randomNick;
});

// Переключение между регистрацией и авторизацией
toggleFormBtn.addEventListener("click", () => {
  isRegistrationMode = !isRegistrationMode;

  if (isRegistrationMode) {
    formTitle.textContent = "Регистрация";
    submitBtnInput.value = "Зарегистрироваться";
    confirmPasswordBox.style.display = "block";
    generateNickButton.style.display = "flex";
    toggleFormBtn.querySelector("button").textContent =
      "Уже есть аккаунт? Войти";
  } else {
    formTitle.textContent = "Авторизация";
    submitBtnInput.value = "Войти";
    confirmPasswordBox.style.display = "none";
    generateNickButton.style.display = "none";
    toggleFormBtn.querySelector("button").textContent =
      "Нет аккаунта? Зарегистрироваться";
  }

  // Очищаем поля
  passwordInput.value = "";
  confirmPasswordInput.value = "";
});

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const nickname = nickInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (nickname === "") {
    alert("Пожалуйста, введите никнейм или сгенерируйте его.");
    return;
  }

  if (password.length < 4) {
    alert("Пароль должен содержать минимум 4 символа.");
    return;
  }

  if (isRegistrationMode) {
    // Режим регистрации
    if (password !== confirmPassword) {
      alert("Пароли не совпадают. Пожалуйста, попробуйте еще раз.");
      return;
    }

    const result = registerUser(nickname, password);
    if (result.success) {
      alert("Регистрация успешна! Добро пожаловать!");
      saveCurrentPlayer(nickname);
      window.location.href = "../game/game.html";
    } else {
      alert(result.message);
    }
  } else {
    // Режим авторизации
    const result = loginUser(nickname, password);
    if (result.success) {
      saveCurrentPlayer(nickname);
      window.location.href = "../game/game.html";
    } else {
      alert(result.message);
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const nickname = nickInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (nickname !== "" && password.length >= 4) {
      if (!isRegistrationMode || password === confirmPassword) {
        submitBtn.click();
      }
    }
  }
});
