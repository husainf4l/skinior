// Types based on actual API response structure
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

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  parentId?: string | null;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string | null;
  customerName: string;
  email?: string | null;
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
  compareAtPrice?: number | null;
  currency: string;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  activeIngredients: string;
  skinType: string;
  concerns: string[];
  usage: string;
  features: string[];
  ingredients: string;
  howToUse: string;
  featuresAr: string[];
  ingredientsAr: string;
  howToUseAr: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  stockQuantity: number;
  viewCount: number;
  salesCount: number;
  categoryId: string;
  brandId?: string | null;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  category?: Category;
  brand?: Brand | null;
  reviews?: Review[];
  reviewStats?: ReviewStats;
  isInStock: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4007/api';

export const productsService = {
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id: string | number): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },
};
