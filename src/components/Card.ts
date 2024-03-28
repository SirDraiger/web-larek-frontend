import { Component } from './base/Component';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

interface ICard {
	category: string;
	title: string;
	image: string;
	price: number | null;
	description: string;
}

export class Card extends Component<ICard> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);

		this._category = container.querySelector('.card__category');
		this._title = container.querySelector('.card__title');
		this._image = container.querySelector('.card__image');
		this._price = container.querySelector('.card__price');
		this._description = container.querySelector('.card__text');
		this._button = container.querySelector('.card__button');

		if (this._button) {
			this._button.addEventListener('click', actions.onClick);
		} else {
			container.addEventListener('click', actions.onClick);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		switch (value) {
			case 'софт-скил':
				this.toggleClass(this._category, 'card__category_soft');
				break;
			case 'хард-скил':
				this.toggleClass(this._category, 'card__category_hard');
				break;
			case 'другое':
				this.toggleClass(this._category, 'card__category_other');
				break;
			case 'дополнительное':
				this.toggleClass(this._category, 'card__category_additional');
				break;
			case 'кнопка':
				this.toggleClass(this._category, 'card__category_button');
				break;
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title() {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}
}
