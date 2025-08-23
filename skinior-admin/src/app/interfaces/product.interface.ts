export interface ProductImage {
  id?: string;
  url: string;
  altText?: string;
  isMain?: boolean;
  isHover?: boolean;
  sortOrder?: number;
}

export interface ProductAttribute {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
}

export interface ProductAttributeValue {
  id: string;
  value: string;
  valueAr: string;
  slug: string;
  hexColor?: string;
  image?: string;
  priceAdjustment: number;
  stockQuantity: number;
  attribute: ProductAttribute;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
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
  barcode?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  
  // Skincare specific fields
  activeIngredients?: string;
  skinType?: string;
  concerns?: string;
  usage?: string;
  features?: string[];
  ingredients?: string;
  howToUse?: string;
  featuresAr?: string[];
  ingredientsAr?: string;
  howToUseAr?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Inventory
  stockQuantity?: number;
  viewCount?: number;
  salesCount?: number;
  isInStock?: boolean;
  
  // Relations
  categoryId?: string;
  brandId?: string;
  category?: Category;
  brand?: Brand;
  
  // Images
  images?: ProductImage[];
  
  // Attributes (variant data like color, size)
  attributes?: Record<string, ProductAttributeValue[]>;
  
  // Reviews
  reviews?: ProductReview[];
  reviewStats?: ReviewStats;
  
  // Timestamps
  createdAt?: Date | string;
  updatedAt?: Date | string;
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
  barcode?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  
  // Skincare specific
  activeIngredients?: string;
  skinType?: string;
  
  // Structured fields
  concerns?: string;
  usage?: string;
  features?: string[];
  ingredients?: string;
  howToUse?: string;
  featuresAr?: string[];
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
  barcode?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  
  // Skincare specific
  activeIngredients?: string;
  skinType?: string;
  
  // Structured fields
  concerns?: string;
  usage?: string;
  features?: string[];
  ingredients?: string;
  howToUse?: string;
  featuresAr?: string[];
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
}

export interface ProductResponse {
  success: boolean;
  data: Product;
  message: string;
  timestamp: string;
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  message: string;
  timestamp: string;
}
