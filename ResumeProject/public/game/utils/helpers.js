// Вспомогательные функции для игры

// Генерация случайного никнейма
export function generateNickname() {
  const adjectives = [
    "Быстрый",
    "Смелый",
    "Умный",
    "Весёлый",
    "Ловкий",
    "Дикий",
    "Корявый",
    "Мохнатый",
    "Грозный",
    "Зелёный",
    "Грязный",
    "Солёный",
    "Острый",
    "Тихий",
    "Шумный",
    "Бомбический",
    "Вихревой",
    "Прыгающий",
    "Летающий",
    "Пламенный",
    "Волосатый"
  ];
  const animals = [
    "Лев",
    "Тигр",
    "Медведь",
    "Волк",
    "Сокол",
    "Банан",
    "Огурец",
    'Джонни',
    'Печенег',
    'Лягушонок',
    'Керасин',
    'Пират',
    'Варвар',
    'Гладиатор',
    'Баловник',
    'Шут',
    'Котик',
    'Пёсик',
    'Ежик',
    'Зайчик'
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomNick = randomAdjective + " " + randomAnimal;
  return randomNick;
}
