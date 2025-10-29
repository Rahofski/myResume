# Структура модульных CSS файлов

## 📁 Разделение стилей по компонентам

### Глобальные стили
- **App.css** - Основные CSS переменные, глобальные стили, базовые классы

### Компоненты страниц
- **src/pages/Navigation.module.css** - Стили навигации
- **src/pages/ProjectPage/ProjectsPage.module.css** - Стили страницы проектов
- **src/pages/TasksPage/TasksPage.module.css** - Стили страницы заданий
- **src/pages/MainPage/MainPage.module.css** - Стили главной страницы (уже существует)

### Компоненты карточек
- **src/pages/TasksPage/components/TaskCard.module.css** - Стили карточки задания

## 🎨 Преимущества модульной архитектуры

1. **Изоляция стилей** - Каждый компонент имеет свои стили без конфликтов
2. **Переиспользование** - Модульные CSS классы можно переиспользовать
3. **Поддержка** - Легче находить и изменять стили конкретного компонента
4. **Производительность** - Загружаются только необходимые стили

## 📋 Обновленные компоненты

✅ **Navigation.tsx** - Использует Navigation.module.css
✅ **ProjectsPage.tsx** - Использует ProjectsPage.module.css  
✅ **TasksPage.tsx** - Использует TasksPage.module.css
✅ **TaskCard.tsx** - Использует TaskCard.module.css
✅ **Header.tsx** - Использует стили из TasksPage.module.css

## 🔄 CSS классы конвертированы в camelCase

Примеры:
- `nav-container` → `navContainer`
- `page-header` → `pageHeader`
- `project-card` → `projectCard`
- `task-badges` → `taskBadges`

Все компоненты теперь используют CSS модули для изоляции стилей!