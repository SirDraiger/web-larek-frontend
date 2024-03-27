import './scss/styles.scss';
import { WebLarekAPI } from './components/WebLarekAPI'
import {API_URL, CDN_URL} from "./utils/constants";
import { AppState, CatalogChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
// 

// Модель данных приложения
const AppData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page( document.body, events);


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

// Нажали на карточку
events.on('card:select', (item) => {
	console.log(item);
	console.log(`тыкнули на карточку`);
})


// Получаем список продуктов
api.getCardList()
	.then(AppData.setCatalog.bind(AppData))
	.catch(err => {
		console.error(err)
	});

console.log(api);
console.log(AppData);
console.log(events);