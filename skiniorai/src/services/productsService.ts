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

import { API_CONFIG } from '@/lib/config';

export const productsService = {
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      console.log('Fetching featured products from:', `${API_CONFIG.API_BASE_URL}/products/featured`);
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/products/featured`);
      
      if (!response.ok) {
        console.error(`Featured products API error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Featured products response:', responseData);
      
      // Handle the API response structure with success/data format
      let products: Product[] = [];
      
      if (responseData.success && Array.isArray(responseData.data)) {
        products = responseData.data;
      } else if (Array.isArray(responseData)) {
        products = responseData;
      } else {
        console.warn('Featured products API returned unexpected data structure:', responseData);
        return [];
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Return empty array instead of throwing to prevent component crashes
      return [];
    }
  },

  async getDiscountedProducts(): Promise<Product[]> {
    try {
      // For now, fetch all products and filter for discounted ones
      // Later, the backend can provide a dedicated endpoint
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      // Filter products that have compareAtPrice (indicating a discount)
      const discountedProducts = data.filter(product => 
        product.compareAtPrice && 
        product.compareAtPrice > product.price &&
        product.isActive
      );
      
      // Sort by discount percentage (highest first) and limit to 4
      return discountedProducts
        .sort((a, b) => {
          const discountA = a.compareAtPrice ? ((a.compareAtPrice - a.price) / a.compareAtPrice) * 100 : 0;
          const discountB = b.compareAtPrice ? ((b.compareAtPrice - b.price) / b.compareAtPrice) * 100 : 0;
          return discountB - discountA;
        })
        .slice(0, 4);
    } catch (error) {
      console.error('Error fetching discounted products:', error);
      throw error;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/products`);
      
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
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();

      if (responseData.success && responseData.data) {
        return responseData.data as Product;
      }
      
      // Fallback for cases where the API might return the product object directly
      if (responseData && typeof responseData === 'object' && !('success' in responseData)) {
        return responseData as Product;
      }

      console.warn('Product API returned unexpected data structure:', responseData);
      return null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },
};
