import { Product, ProductQueryParams, ProductsApiResponse, ProductsResult } from '@/types/product';
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
      
      // Limit to 10 products for the home page
      return products.slice(0, 10);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Return empty array instead of throwing to prevent component crashes
      return [];
    }
  },

  async getDiscountedProducts(): Promise<Product[]> {
    try {
      // Use the new filtered API to get products on sale
      const result = await this.getProducts({
        onSale: true,
        isActive: true,
        limit: 4,
        sortBy: 'price',
        sortOrder: 'desc'
      });
      
      return result.products;
    } catch (error) {
      console.error('Error fetching discounted products:', error);
      // Fallback to legacy method
      try {
        const response = await fetch(`${API_CONFIG.API_BASE_URL}/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        let products: Product[] = [];
        
        if (responseData.success && Array.isArray(responseData.data)) {
          products = responseData.data;
        } else if (Array.isArray(responseData)) {
          products = responseData;
        }
        
        const discountedProducts = products.filter(product => 
          product.compareAtPrice && 
          product.compareAtPrice > product.price &&
          product.isActive
        );
        
        return discountedProducts
          .sort((a, b) => {
            const discountA = a.compareAtPrice ? ((a.compareAtPrice - a.price) / a.compareAtPrice) * 100 : 0;
            const discountB = b.compareAtPrice ? ((b.compareAtPrice - b.price) / b.compareAtPrice) * 100 : 0;
            return discountB - discountA;
          })
          .slice(0, 4);
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError);
        return [];
      }
    }
  },

  async getProducts(filters?: ProductQueryParams): Promise<ProductsResult> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.skinType) params.append('skinType', filters.skinType);
        if (filters.concernsFilter && filters.concernsFilter.length > 0) params.append('concerns', filters.concernsFilter.join(','));
        if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString());
        if (filters.isNew !== undefined) params.append('isNew', filters.isNew.toString());
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters.onSale !== undefined) params.append('onSale', filters.onSale.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      }
      
      const url = `${API_CONFIG.API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching products from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData: ProductsApiResponse = await response.json();
      console.log('Products response:', responseData);
      
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
      
      // Fallback for legacy API format (array of products)
      if (Array.isArray(responseData)) {
        const products = responseData as Product[];
        return {
          products,
          pagination: {
            page: filters?.page || 1,
            limit: filters?.limit || products.length,
            total: products.length,
            pages: 1,
            hasNext: false,
            hasPrev: false
          },
          filters: {
            categories: [],
            brands: [],
            skinTypes: [],
            concerns: [],
            priceRange: {
              min: 0,
              max: 1000
            }
          }
        };
      }
      
      throw new Error('Unexpected API response format');
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
