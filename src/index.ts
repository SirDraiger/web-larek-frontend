import './scss/styles.scss';
import { WebLarekAPI } from './components/WebLarekAPI';
import { API_URL, CDN_URL, paymentType } from './utils/constants';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { IContactForm, IOrderForm, IProduct } from './types';
import { Basket } from './components/common/Basket';
import { Contacts, Order } from './components/Order';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events, {
	onClick: (evt: Event) => events.emit('orderPayment:change', evt.target),
});
const contacts = new Contacts(cloneTemplate(contactTemplate), events);

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// Изменились элементы корзины
events.on('basket:changed', () => {
	page.counter = appData.basket.length;
});

// Нажали на карточку
events.on('card:select', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:open', item);
			if (appData.inBasket(item.id)) {
				appData.removeFromBasket(item);
				card.inBasket = item.inBasket;
			} else {
				appData.addToBasket(item);
				card.inBasket = item.inBasket;
			}

			modal.close();
		},
	});

	return modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			inBasket: item.inBasket,
			price: item.price,
		}),
	});
});

// Блокируем прокрутку страницы если открыто модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем прокрутку страницы при закрытии модального окна
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем список продуктов
api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// Открытие корзины
events.on('basket:open', () => {
	basket.items = appData.basket.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.removeFromBasket(item);
				events.emit('basket:remove');
			},
		});

		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	return modal.render({
		content: basket.render({
			total: appData.getTotal(),
		}),
	});
});

// Удаление товара из корзины
events.on('basket:remove', () => {
	basket.items = appData.basket.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.removeFromBasket(item);
				events.emit('basket:remove');
			},
		});

		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	return modal.render({
		content: basket.render({
			total: appData.getTotal(),
		}),
	});
});

// Открытие формы выбора оплаты и ввода адреса
events.on('order:open', () => {
	order.payment = appData.order.payment;
	modal.render({
		content: order.render({
			address: appData.order.address,
			payment: appData.order.payment,
			valid: appData.validateOrder(),
			errors: [],
		}),
	});
	appData.order.total = appData.getTotal();
	// Добавляем в заказ id товаров из корзины
	appData.order.items = appData.basket.map((item) => item.id);
});

// Изменился тип оплаты заказа
events.on('orderPayment:change', (button: HTMLButtonElement) => {
	appData.order.payment = paymentType[button.getAttribute('name')];
	order.payment = appData.order.payment;
});

// Изменилось поле формы заказа
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось состояние валидации формы заказа
events.on('formErrorsOrder:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Открытие формы ввода контактов пользователя
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: appData.order.email,
			phone: appData.order.phone,
			valid: appData.validateContact(),
			errors: [],
		}),
	});
});

// Изменилось поле формы заказа
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

// Изменилось состояние валидации формы контактов
events.on('formErrorsContact:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Успешная оплата заказа
events.on('contacts:submit', () => {
	api
		.sendOrder(appData.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: appData.getTotal(),
				}),
			});

			appData.clearBasket();
			appData.clearOrder();
		})
		.catch((err) => console.error(err));
});
