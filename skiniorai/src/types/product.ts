// Product Types - Matching backend schema exactly

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  altText: string;
  isMain: boolean;
  isHover: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  parentId: number | null;
  createdAt: string;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number | null;
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
  id: number;
  title: string;
  titleAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  activeIngredients: string;
  skinType: string;
  concerns: string; // JSON string array
  usage: string;
  features: string[]; // Array for current locale
  ingredients: string;
  howToUse: string;
  featuresAr: string; // JSON string array
  ingredientsAr: string;
  howToUseAr: string;
  metaTitle: string | null;
  metaDescription: string | null;
  stockQuantity: number;
  viewCount: number;
  salesCount: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  category: ProductCategory;
  reviews: ProductReview[];
  description: string; // Localized based on API call
  reviewStats: ReviewStats;
  isInStock: boolean;
}

// For ProductCard component - simplified view
export interface ProductCardData {
  id: number;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: ProductImage[];
  isNew: boolean;
  isInStock: boolean;
  reviewStats: ReviewStats;
}

// API Response types
export type ProductResponse = Product;
export type ProductsResponse = Product[];
export type FeaturedProductsResponse = Product[];
