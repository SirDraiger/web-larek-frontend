import './scss/styles.scss';
import { WebLarekAPI } from './components/WebLarekAPI'
import {API_URL, CDN_URL} from "./utils/constants";
import { AppState, CatalogChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { IProduct } from './types';
import { Basket } from './components/common/Basket';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
// 

// Модель данных приложения
const AppData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = AppData.catalog.map(item => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => 
				events.emit('card:select', item)
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		})
	})	
})

// Изменились элементы корзины
events.on('basket:changed', () => {
	page.counter = AppData.basket.length;
})

// Нажали на карточку
events.on('card:select', (item: IProduct) => {

	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => 	{
			
			events.emit('card:open', item)
			if(AppData.inBasket(item.id)) {
				AppData.removeFromBasket(item);
				card.inBasket = item.inBasket;
			} else {
				AppData.addToBasket(item);
				card.inBasket = item.inBasket;
			}

			modal.close();

		}
	});
	return modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			inBasket: item.inBasket,
			price: item.price
		})
	});
})

// Блокируем прокрутку страницы если открыто модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем прокрутку страницы при закрытии модального окна
events.on('modal:close', () => {
	page.locked = false;
})

// Получаем список продуктов
api
	.getCardList()
	.then(AppData.setCatalog.bind(AppData))
	.catch((err) => {
		console.error(err);
	});




// Открытие корзины
events.on('basket:open', () => {

	basket.items = AppData.basket.map((item, index) => {

		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				AppData.removeFromBasket(item);
				events.emit('basket:remove');
			}
		});
			return card.render({
				title: item.title,
				price: item.price,
				index: index + 1
			});
	})


	return modal.render({
		content: basket.render({
			total: AppData.getTotal()
		})
	});
});

// Удаление товара из корзины
events.on('basket:remove', () => {

	basket.items = AppData.basket.map((item, index) => {

		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				console.log(AppData.basket);
				AppData.removeFromBasket(item);
				console.log(AppData.basket);
				console.log(AppData.catalog);
				events.emit('basket:remove');
			}
		});
			return card.render({
				title: item.title,
				price: item.price,
				index: index + 1
			});
	})


	return modal.render({
		content: basket.render({
			total: AppData.getTotal()
		})
	});
});