import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IBasketView {
}

export class Basket extends Component<IBasketView> {
  protected _title: HTMLElement;


  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

  }
}