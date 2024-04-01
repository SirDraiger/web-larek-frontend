import {
	IAppState,
	IContactForm,
	IFormErrors,
	IOrder,
	IOrderForm,
	IProduct,
	IProductData,
} from '../types/index';
import { Model } from './base/Model';

// Класс для хранения данных приложений
export class AppState extends Model<IAppState> {
	catalog: IProduct[];
	basket: IProduct[] = [];
	order: IOrder = {
		payment: 'online',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};

	formErrors: IFormErrors = {};

	// Создание карточек с товаров
	setCatalog(items: IProductData[]) {
		this.catalog = items.map((item) => new CardItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	// Добавление товара в корзину
	addToBasket(item: IProduct) {
		if (
			!this.inBasket(item.id) &&
			typeof item.price === 'number' &&
			item.price > 0
		) {
			this.basket.push(item);
			item.inBasket = true;
			this.emitChanges('basket:changed');
		}
	}

	// Удаление товара из корзины
	removeFromBasket(item: IProduct) {
		item.inBasket = false;
		const index = this.basket.indexOf(item);
		this.basket.splice(index, 1);
		this.emitChanges('basket:changed');
	}

	// Очистка корзины
	clearBasket() {
		this.basket.forEach((item) => {
			item.inBasket = false;
			this.basket = [];
			this.emitChanges('basket:changed');
		});
	}

	// Очистка заказа (оставляем адрес и контакты на случай ещё одного заказа)
	clearOrder() {
		this.order.total = 0;
		this.order.items = [];
	}

	// Проверка на наличие товара в корзине
	inBasket(id: string) {
		return !!this.basket.find((item) => item.id === id);
	}

	// Получение суммы заказа на основании данных в корзине
	getTotal() {
		let sum: number = 0;
		this.basket.forEach((item) => {
			sum = sum + item.price;
		});
		return sum;
	}

	// Запись данных из формы заказа
	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	// Валидация заказа (выбор оплаты и ввод адреса)
	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}

		this.formErrors = errors;
		this.events.emit('formErrorsOrder:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	// Запись данных формы контактов
	setContactField(field: keyof IContactForm, value: string) {
		this.order[field] = value;

		if (this.validateContact()) {
			this.events.emit('contact:ready');
		}
	}

	// Валидация контактов (форма ввода почты и телефона)
	validateContact() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать почту';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrorsContact:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
}

export type CatalogChangeEvent = {
	catalog: CardItem[];
};

// Класс для хранения данных карточки
class CardItem extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	inBasket: boolean = false;
}
