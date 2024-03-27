import { Component } from "./base/Component";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

interface ICard {
  category: string;
  title: string;
  image: string;
  price: number | null;
}

export class Card extends Component<ICard> {
  // protected _button: HTMLButtonElement;
  protected _category: HTMLElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);

    // this._button = container.querySelector('.card');
    this._category = container.querySelector('.card__category');
    this._title = container.querySelector('.card__title');
    this._image = container.querySelector('.card__image');
    this._price = container.querySelector('.card__price');
    container.addEventListener("click", actions.onClick);
  }

  set category(value:string) {
    this.setText(this._category, value)
  }

  set title(value:string) {
    this.setText(this._title, value)
  }

  get title() {
    return this._title.textContent || "";
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title)
  }

  set price(value: number) {
    if(value === null) {
      this.setText(this._price, "Бесценно");
    } else {
      this.setText(this._price, `${value} синапсов`);
    }
  }
}