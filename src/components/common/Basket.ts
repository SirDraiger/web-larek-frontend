import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IBasketView {
  items: HTMLElement[];
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;


  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);

    this.items = [];
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
}