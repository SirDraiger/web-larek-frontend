import { IAppState, IContactForm, IFormErrors, IItemOrder, IOrder, IOrderForm, IProduct} from "../types/index"
import { Model } from "./base/Model";

// Класс для хранения данных приложений
export class AppState extends Model<IAppState> {
  catalog: IProduct[];
  basket: IProduct[] = [];
  order: IOrder = {
    payment: '',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: []
  }

  formErrors: IFormErrors = {};

  setCatalog(items: IProduct[]) {
    this.catalog = items.map(item => new CardItem(item, this.events));
    this.emitChanges("items:changed", {catalog: this.catalog});
  }

  addToBasket(item: IProduct) {
    if(!this.inBasket(item.id) && typeof(item.price) === 'number' && item.price > 0) {
        this.basket.push(item);
        item.inBasket = true;
        this.emitChanges("basket:changed");
      }
    }


    // Переделать это безобразие
    removeFromBasket(item: IProduct) {
      item.inBasket = false;
      const index = this.basket.indexOf(item);
      this.basket.splice(index, 1);
      this.emitChanges("basket:changed");
      // this.emitChanges("basket:remove");
      }

    inBasket(id: string) {
      return !!this.basket.find(item => item.id === id);
    }

    getTotal() {
      let sum: number = 0;
      this.basket.forEach(item => {
        sum = sum + item.price
      })
      return sum;
    }

    // Запись адреса из формы
    setOrderField(field: keyof IOrderForm, value: string) {
      this.order[field] = value;

      if(this.validateOrder()) {
        this.events.emit('order:ready', this.order);
      }
    }

    // Валидация заказа (выбор оплаты и ввод адреса)
    validateOrder() {
      const errors: typeof this.formErrors = {};

      if(!this.order.payment) {
        errors.payment = 'Необходимо выбрать способ оплаты';
      }

      if(!this.order.address) {
        errors.address = 'Необходимо указать адрес доставки';
      }

      this.formErrors = errors;
      this.events.emit('formErrorsOrder:change', this.formErrors);

      return Object.keys(errors).length === 0;
    }

    setContactField(field: keyof IContactForm, value: string) {
      this.order[field] = value;

      if(this.validateContact()) {
        this.events.emit('contact:ready');
      }
    }

    // Валидация контактов (форма ввода почты и телефона)
    validateContact() {
      const errors: typeof this.formErrors = {};

      if(!this.order.email) {
        errors.email = 'Необходимо указать почту';
      }

      if(!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
      }

      this.formErrors = errors;
      this.events.emit('formErrorsContact:change', this.formErrors);

      return Object.keys(errors).length === 0;
    }
  }

export type CatalogChangeEvent = {
  catalog: CardItem[];
}

// Класс для хранения данных карточки
class CardItem extends Model<IProduct> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  inBasket: boolean = false;
}