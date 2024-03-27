import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


// Класс для отрисовски и взаимодействия с основными блоками
interface IPage {
  catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
  protected _catalog: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._catalog = ensureElement<HTMLElement>('.gallery');
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }
}