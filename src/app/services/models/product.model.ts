export interface Image {
  id?: number;
  url: string;
  altText?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  barcode:string;
  brand:string;
  isFeatured:boolean;
  price: number;
  categoryId: number;
  images?: Image[];
}
