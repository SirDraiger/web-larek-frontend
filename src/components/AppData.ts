import { IAppState, IProduct} from "../types/index"
import { Model } from "./base/Model";

// Класс для хранения данных приложений
export class AppState extends Model<IAppState> {
  catalog: IProduct[];
  basket: IProduct[] = [];

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