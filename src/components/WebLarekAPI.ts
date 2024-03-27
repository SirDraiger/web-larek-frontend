import { Api, ApiListResponse } from "./base/api";
import { IProduct } from "../types/index";

// Интерфейс для описания класса по взаимодействию с API
interface IWebLarekAPI {
  getCardList: () => Promise<IProduct[]>;
  getCardItem: (id: string) => Promise<IProduct>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getCardList(): Promise<IProduct[]> {
    return this.get('/product/').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    );
  }


  getCardItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then((item: IProduct) => ({
      ...item,
      image: this.cdn + item.image
    }))
  };
}