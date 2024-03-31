import { IContactForm, IOrderForm } from "../types";
import { paymentType } from "../utils/constants";
import { ensureAllElements } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";


export interface IOrderActions {
	onClick: (event: MouseEvent) => void;
}

export class Order extends Form<IOrderForm> {
  protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents, actions: IOrderActions) {
    super(container, events);

    this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);

    this._buttons.forEach(button => {
      paymentType
      button.addEventListener('click', actions.onClick);
    })
  }

  // Изменение стиля кнопки выбора оплаты
  set payment(paymentName: string) {
    // определяем тип оплаты на основании его названия
    const payment = Object.keys(paymentType).find(key => paymentType[key] === paymentName);
    // перебираем кнопки в массиве и в зависимости от name вешаем или снимаем класс
    this._buttons.forEach(button => {
      if(button.name === payment) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    })
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}

export class Contacts extends Form<IContactForm> {

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }
}