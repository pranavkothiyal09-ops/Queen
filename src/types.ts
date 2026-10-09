export interface ProductItem {
  id: number;
  name: string;
  price: number;
  image: string;
  url: string;
  localSrc?: string;
  alt: string;
  category?: string;
  description?: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}
