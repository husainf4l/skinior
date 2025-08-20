export interface ProductImage {
  id?: string;
  url: string;
  altText?: string;
  isMain?: boolean;
  isHover?: boolean;
  sortOrder?: number;
}

export interface Product {
  id: string;
  title: string;
  titleAr?: string;
  slug?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  
  // Skincare specific fields
  activeIngredients?: string;
  skinType?: string;
  concerns?: string;
  usage?: string;
  features?: string;
  ingredients?: string;
  howToUse?: string;
  featuresAr?: string;
  ingredientsAr?: string;
  howToUseAr?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Inventory
  stockQuantity?: number;
  viewCount?: number;
  salesCount?: number;
  
  // Relations
  categoryId?: string;
  brandId?: string;
  category?: string;
  brand?: string;
  
  // Images
  images?: ProductImage[];
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  
  // Extra data
  extra?: any;
}

export interface CreateProductImageDto {
  url: string;
  altText?: string;
  isMain?: boolean;
  isHover?: boolean;
  sortOrder?: number;
}

export interface CreateProductDto {
  title: string;
  titleAr?: string;
  slug?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  
  // Skincare specific
  activeIngredients?: string;
  skinType?: string;
  
  // Structured fields (stored as strings in database)
  concerns?: string;
  usage?: string;
  features?: string;
  ingredients?: string;
  howToUse?: string;
  featuresAr?: string;
  ingredientsAr?: string;
  howToUseAr?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Inventory
  stockQuantity?: number;
  viewCount?: number;
  salesCount?: number;
  
  // Relations
  categoryId?: string;
  brandId?: string;
  
  // Images - nested DTO
  images?: CreateProductImageDto[];
  
  // Extra data
  extra?: any;
}

export interface UpdateProductImageDto {
  url?: string;
  altText?: string;
  isMain?: boolean;
  isHover?: boolean;
  sortOrder?: number;
}

export interface UpdateProductDto {
  title?: string;
  titleAr?: string;
  slug?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price?: number;
  compareAtPrice?: number;
  currency?: string;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  
  // Skincare specific
  activeIngredients?: string;
  skinType?: string;
  
  // Structured fields (stored as strings in database)
  concerns?: string;
  usage?: string;
  features?: string;
  ingredients?: string;
  howToUse?: string;
  featuresAr?: string;
  ingredientsAr?: string;
  howToUseAr?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Inventory
  stockQuantity?: number;
  viewCount?: number;
  salesCount?: number;
  
  // Relations
  categoryId?: string;
  brandId?: string;
  
  // Images - nested DTO
  images?: UpdateProductImageDto[];
  
  // Extra data
  extra?: any;
}
