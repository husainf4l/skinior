// Product Types - Matching backend schema exactly

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  isMain: boolean;
  isHover: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  parentId: string | null;
  createdAt: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  logo?: string;
  createdAt: string;
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
  hexColor: string | null;
  image: string | null;
  priceAdjustment: number;
  stockQuantity: number;
  attribute: ProductAttribute;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string | null;
  logo: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string | null;
  customerName: string;
  email: string | null;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttributes {
  [attributeName: string]: ProductAttributeValue[];
}

export interface ProductAttributeValue {
  id: string;
  value: string;
  valueAr: string;
  slug: string;
  hexColor: string | null;
  image: string | null;
  priceAdjustment: number;
  stockQuantity: number;
  attribute: ProductAttribute;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string | null;
  customerName: string;
  email: string | null;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface Product {
  id: string;
  title: string;
  titleAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  sku: string;
  barcode: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  activeIngredients: string | null;
  skinType: string | null;
  concerns: string[] | null;
  usage: string | null;
  features: string[];
  ingredients: string | null;
  howToUse: string | null;
  featuresAr: string[];
  ingredientsAr: string | null;
  howToUseAr: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  stockQuantity: number;
  viewCount: number;
  salesCount: number;
  categoryId: string | null;
  brandId: string | null;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  category: Category | null;
  brand: Brand | null;
  reviews: Review[];
  attributes: ProductAttributes;
  reviewStats: ReviewStats;
  isInStock: boolean;
}

// For ProductCard component - simplified view
export interface ProductCardData {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: ProductImage[];
  isNew: boolean;
  isInStock: boolean;
  reviewStats: ReviewStats;
  attributes?: Record<string, ProductAttributeValue[]>;
}

// API Response types
export type ProductResponse = Product;
export type ProductsResponse = Product[];
export type FeaturedProductsResponse = Product[];
