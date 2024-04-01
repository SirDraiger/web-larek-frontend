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

## Компоненты модели данных
### Класс AppState
Основной класс в котором хранятся данные приложения, а так же методы для работы с ними. Насладуется от базового класса Model. <br>
Содержит следующие свойства:
```
catalog: IProduct[]; // хранит данные о товарах
basket: IProduct[] = []; // хранит список товаров в корзине
order: IOrder = { // хранит данные о заказе
  payment: 'online', // тип оплаты заказа
	email: '', // адрес почты покупателя
	phone: '', // телефон покупателя
	address: '', // адрес покупателя
	total: 0, // сумма заказа
	items: [], // содержимое заказа
	};

	formErrors: IFormErrors = {}; // хранение ошибок валидации
```
Содержит следующие методы:
* setCatalog() - создаёт массив карточек товаров (экземпляры класса CardItem)
* addToBasket() - добавляет товар в корзину
* removeFromBasket() - удаляет товар из корзины
* clearBasket() - очищает корзину
* clearOrder() - очищает данные текущего заказа
* inBasket() - проверяет наличие товара в корзине
* getTotal() - отдаёт сумму товаров из корзины
* setOrderField() - заполняет данные формы в заказ (тип оплаты, адрес)
* validateOrder() - проверяет валидацию типа оплаты и адреса
* setContactField() - заполняет данные формы в заказ (почта, телефон)
* validateContact() - проверяет данные почты и телефона

### Класс CardItem
Класс данных отдельной карточки. Хранит в себе информацию по товару. Наследуется от базового класса Model. <br>
Содердит следующие свойства:
```
id: string; // идентификатор товара
description: string; // описание товара
image: string; // ссылка на картинку товара
title: string; // название товара
category: string; // категория товара
price: number | null; // цена товара
inBasket: boolean = false; // признак наличия товара в корзине
```

## Компоненты представления
### Класс Basket
Класс отображения корзины. Наследуется от класса Component<IBasketView>.
```
interface IBasketView {
	items: HTMLElement[];
	total: number;
}
```
* Сеттер items - отрисовывает список элементов корзины
* Сеттер total - отрисовывает сумму заказа

### Класс Form<T>
Класс отображения формы. Наследуется от класса Component<IFormState>.
```
interface IFormState {
	valid: boolean;
	errors: string[];
}
```
* Сеттер valid - устанавливает свойство валидации формы.
* Сеттер errors - отрисовывает ошибки валидации формы.

Имеет следующие методы:
* render() - возвращает элемент формы

### Класс Modal
Класс для отображения модального окна. Наследуется от класса Component<IModalData>.
```
interface IModalData {
	content: HTMLElement;
}
```
* Сеттер content - отрисовывает содержимое внутри модального окна
Имеет следующие методы:
* open - открыть модальное окно
* close - закрыть модальное окно
* render - возвращает элемент модального окна

### Класс Success
Класс для отображения элемента при успешной оплате заказа. Наследуется от класса Component<ISuccess>.
```
interface ISuccess {
	total: number;
}
```
* Сеттер total - отрисовывает общую сумму списания

### Card
Класс для отображения карточки товара. Наследуется от класса Component<ICard>.
```
interface ICard {
	category: string;
	title: string;
	image: string;
	price: number | null;
	description: string;
	inBasket: boolean;
	index: number;
}
```
* Сеттер category - устанавливает категорию товара
* Сеттер title - устанавливает название товара
* Сеттер image - устанавливает изображение товара
* Сеттер price - устанавливает цену товара
* Сеттер inBasket - устанавливает статус наличия корзины. От статуса зависи отображение кнопки "Купить"
* Сеттер index - устанавливает порядковый номер товара
* Геттер title - отдаёт название товара

### Order
Класс для отображения формы выбора оплаты и ввода адреса. Наследуется от класса Form<IOrderForm>
```
interface IOrderForm {
  payment: string;
  address: string;
}
```
* сеттер payment - устанавливает тип оплаты заказа
* сеттер address - устанавливает адрес доставки
  
### Contacts
Класс для отображения формы ввода почты и телефона. Наследуется от класса Form<IContactForm>
```
interface IContactForm {
  email: string;
  phone: string;
}
```
* сеттер email - устанавливает почтовый адрес
* сеттер phone - устанавливает номер телефона

### Page
Класс для управления отображением основных блоков страницы (каталог товаров, счётчик корзины, блокировка прокрутки). Наследуется от класса Component<IPage>.
```
interface IPage {
	catalog: HTMLElement[];
	locked: boolean;
	counter: number;
}
```
* Сеттер catalog - выводит на страницу каталог товаров
* Сеттер locked - блокировка прокрутки страницы
* Сеттер counter - обновляет счётчик товаров в корзине

## Контроллер
Код написанный в файле index.ts отвечает за взаимодесвие со слоем модели и передачи данных из него в слой view. <br>
Основные события:
* items:changed - изменение каталога товаров
* basket:changed - изменение содержимого корзины
* card:select - нажатие на карточку товара
* card:open - открытие карточки товара
* modal:open - открытие модального окна
* modal:close - закрытие модального окна
* basket:open - открытие корзины
* basket:remove - удаление товара из корзины
* order:open - открытие формы заказа
* orderPayment:change - изменение типа оплаты
* /^order\..*:change/ - изменение полей в форме заказа
* formErrorsOrder:change - изменение состояния валидации формы заказа
* order:submit - открытие формы контактов
* /^contacts\..*:change/ - изменение полей в форме контактов
* formErrorsContact:change - изменение состояния валидации формы контактов
* contacts:submit - успешная оплата заказа

## Взаимодействие с сервером
### Класс WebLarekAPI
Класс для взаимодействие с серверов. Наследуется от базового класса Api.
```
interface IWebLarekAPI {
  getCardList: () => Promise<IProductData[]>;
  getCardItem: (id: string) => Promise<IProductData>;
  sendOrder: (order: IOrder) => Promise<IOrder>;
}
```
Имеет следующие методы:
* getCardList - get запрос, получение списка товаров
* getCardItem - get запрос, получение товара по его id
* sendOrder - post запрос, отправка данных по заказу

## Ключевые типы данных
```
// Интерфейс данных продукта (Ответ от сервера)
export interface IProductData {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;  
}

// Интерфейс данных о товаре
export interface IProduct extends IProductData {
  inBasket: boolean;
}

// Интерфейс модели данных приложения
export interface IAppState {
  catalog: IProduct[];
  basket: IProduct[];
}

// Интренфейс формы выбора оплаты и доставки
export interface IOrderForm {
  payment: string;
  address: string;
}

// Интерфейс формы ввода контактных данных
export interface IContactForm {
  email: string;
  phone: string;
}

// Интерфейс товара в заказе 
interface IItemOrder {
  items: string[];
}

// Интерфейс заказа
export interface IOrder extends IOrderForm, IContactForm, IItemOrder {
  total: number;
}

// Общий тип для валидации форм заказа
export type IFormErrors = Partial<Record<keyof IOrder, string>>;
```