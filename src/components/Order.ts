import { IContactForm, IOrderForm } from "../types";
import { ensureAllElements, ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class Order extends Form<IOrderForm> {
  protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);

    this._buttons.forEach(button => {
      button.addEventListener('click', () => {
        alert(`Выбрали оплату ${button.name}`);
      })
    })
  }



  
  set payment(name: string) {


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