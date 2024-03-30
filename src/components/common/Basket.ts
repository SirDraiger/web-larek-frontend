import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;


  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = container.querySelector('.basket__price');
    this._button = container.querySelector('.basket__button');

    this.items = [];

    this._button.addEventListener('click', () => {
      events.emit("order: open");
      alert("Открыли модалку с выбором оплаты");
    })
  }

  set items(items: HTMLElement[]) {
    if(items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }));
    }
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
    
    if(value === 0) {
      this.setDisabled(this._button, true);
    } else {
      this.setDisabled(this._button, false);
    }
  }
}