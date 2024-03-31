// Интерфейс данных продукта (Ответ от сервера)
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;  
  inBasket?: boolean; //Вынести свойство в отдельный интерфейс
}

// Интерфейс модели данных приложения
export interface IAppState {
  catalog: IProduct[];
  basket: IProduct[];
}

// Интренфейс формы выбора оплаты и доставки
export interface IOrderForm {
  payment: string;
  address: string;
}

// Интерфейс формы ввода контактных данных
export interface IContactForm {
  email: string;
  phone: string;
}

// Интерфейс товара в заказе 
export interface IItemOrder {
  items: string[];
}

// Интерфейс заказа
export interface IOrder extends IOrderForm, IContactForm, IItemOrder {
  total: number;
}

// Общий тип для валидации форм заказа
export type IFormErrors = Partial<Record<keyof IOrder, string>>;