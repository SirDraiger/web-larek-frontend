import { Api, ApiListResponse } from "./base/api";
import { IOrder, IProductData } from "../types/index";

// Интерфейс для описания класса по взаимодействию с API
interface IWebLarekAPI {
  getCardList: () => Promise<IProductData[]>;
  getCardItem: (id: string) => Promise<IProductData>;
  sendOrder: (order: IOrder) => Promise<IOrder>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // Получение списка товаров
  getCardList(): Promise<IProductData[]> {
    return this.get('/product/').then((data: ApiListResponse<IProductData>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    );
  }

  // Получение товара по его id
  getCardItem(id: string): Promise<IProductData> {
    return this.get(`/product/${id}`).then((item: IProductData) => ({
      ...item,
      image: this.cdn + item.image
    }))
  };

  // Отправка заказа
  sendOrder(order: IOrder): Promise<IOrder> {
    return this.post(`/order/`, order).then((data: IOrder) => data);
  }
}