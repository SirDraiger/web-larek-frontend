import { IAppState, IProduct} from "../types/index"
import { Model } from "./base/Model";

// Класс для хранения данных приложений
export class AppState extends Model<IAppState> {
  catalog: IProduct[];

  setCatalog(items: IProduct[]) {
    this.catalog = items.map(item => new CardItem(item, this.events));
    this.emitChanges("items:changed", {catalog: this.catalog});
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
}