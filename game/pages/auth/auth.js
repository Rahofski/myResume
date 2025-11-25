import { generateNickname } from "../../utils/helpers.js";
import { saveCurrentPlayer } from "../../utils/storage.js";
const generateNickButton = document.getElementById("generate-nick-btn");
const nickInput = document.getElementById("nickInput");
const submitBtn = document.getElementById("submit-btn");

generateNickButton.addEventListener("click", () => {
  const randomNick = generateNickname();
  nickInput.value = randomNick;
});

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const nickname = nickInput.value.trim();

  if (nickname === "") {
    alert("Пожалуйста, введите никнейм или сгенерируйте его.");
    return;
  }

  // Сохраняем имя игрока в localStorage
  if (saveCurrentPlayer(nickname)) {
    console.log("Игрок сохранен:", nickname);
    // Переходим на игровую страницу
    window.location.href = "../game/game.html";
  } else {
    alert("Ошибка сохранения данных. Попробуйте еще раз.");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && nickInput.value.trim() !== "") {
    submitBtn.click();
  }
});
