// Интерфейс данных продукта (Ответ от сервера)
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс модели данных приложения
export interface IAppState {
  catalog: IProduct[];
}