# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовый код
### Класс api
Базовый класс для работы с API, реализует методы работы с ним. На основе данного класса реализуется класс - WebLarekAPI. <br>
Содержит следующии методы:
* get - отправляет get запрос
* post - отправляет post запрос

### Класс Model<T>
Абстрактный базовый класс. На основе данного класса реализуются классы модели - AppState, CardItem. <br>
Содержит следующие методы:
* emitChanges - сообщает всем, что модель изменилась

### Класс EventEmitter
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события. <br>
Содержит следующии методы:
* on - устанавливает обработчик на событие
* off - снимает обработчик с события
* emit - инициирует событие с данными
* onAll - устанавливает обработчик на все события
* offAll - снимает обработчик со всех событий
* trigger - устанавливает триггер, генерирующий событие при вызове

### Класс Component<T>
Базовый класс, на основании которого реализуются классы слоя View. Данный класс реализует методы для взаимодействия с DOM. <br>
Содержит следующие методы:
* toggleClass - переключает класс элемента
* setText - устанавливает текстовое содержание
* setDisabled - меняет статус блокировки элемента
* setHidden - скрывает элемент 
* setVisible - показывает элемент
* setImage - устанавливает изображение с альтернативным текстом
* render- возвращает корневой DOM-элемент