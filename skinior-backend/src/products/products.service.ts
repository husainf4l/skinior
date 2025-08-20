import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFeaturedProducts() {
    const products = await this.prismaService.product.findMany({
      where: { 
        isActive: true,
        isFeatured: true 
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        brand: true,
        reviews: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
    });

    return this.addProductStats(products);
  }

  async getAllProducts() {
    const products = await this.prismaService.product.findMany({
      where: { isActive: true },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        brand: true,
        reviews: {
          where: { isPublished: true },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return this.addProductStats(products);
  }

  async getProductById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        brand: true,
        reviews: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return null;
    }

    return this.addProductStats([product])[0];
  }

  async getProductsByCategory(categoryId: string) {
    const products = await this.prismaService.product.findMany({
      where: { 
        isActive: true,
        categoryId 
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        brand: true,
        reviews: {
          where: { isPublished: true },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return this.addProductStats(products);
  }

  async searchProducts(query: string) {
    const products = await this.prismaService.product.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { titleAr: { contains: query, mode: 'insensitive' } },
          { descriptionEn: { contains: query, mode: 'insensitive' } },
          { descriptionAr: { contains: query, mode: 'insensitive' } },
          { activeIngredients: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        brand: true,
        reviews: {
          where: { isPublished: true },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return this.addProductStats(products);
  }

  private addProductStats(products: any[]) {
    return products.map(product => {
      const totalReviews = product.reviews?.length || 0;
      const averageRating = totalReviews > 0
        ? product.reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / totalReviews
        : 0;

      const safeParse = (value: any) => {
        if (value == null) return null;
        if (Array.isArray(value)) return value;
        if (typeof value === 'object') return value;
        if (typeof value === 'string') {
          const trimmed = value.trim();
          if (trimmed === '') return null;

          // If it looks like JSON (array or object), try parsing
          if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
            try {
              return JSON.parse(trimmed);
            } catch (e) {
              // Fall back to returning the raw string if JSON.parse fails
              return trimmed;
            }
          }

          // If comma-separated values, return as array
          if (trimmed.includes(',')) {
            return trimmed.split(',').map((s: string) => s.trim()).filter(Boolean);
          }

          // Single plain string -> return as single-item array for consistency
          return [trimmed];
        }

        return value;
      };

      const parsedProduct = {
        ...product,
        features: safeParse(product.features),
        featuresAr: safeParse(product.featuresAr),
        concerns: safeParse(product.concerns),
      };

      return {
        ...parsedProduct,
        reviewStats: {
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalReviews,
        },
        isInStock: (product.stockQuantity ?? 0) > 0,
      };
    });
  }

  async createProduct(data: any) {
    // Transform array fields to JSON strings for database storage
    const transformedData = this.transformDataForDatabase(data);
    
    return this.prismaService.product.create({
      data: transformedData,
      include: {
        images: true,
        category: true,
        brand: true,
      },
    });
  }

  async updateProduct(id: string, data: any) {
    // Transform array fields to JSON strings for database storage
    const transformedData = this.transformDataForDatabase(data);
    
    return this.prismaService.product.update({
      where: { id },
      data: transformedData,
      include: {
        images: true,
        category: true,
        brand: true,
      },
    });
  }

  private transformDataForDatabase(data: any) {
    const transformed = { ...data };
    
    // Convert array fields to JSON strings for database storage
    const arrayFields = ['concerns', 'features', 'ingredients', 'howToUse'];
    
    arrayFields.forEach(field => {
      if (transformed[field] !== undefined) {
        if (Array.isArray(transformed[field])) {
          transformed[field] = JSON.stringify(transformed[field]);
        } else if (transformed[field] === null) {
          // Keep null as null
          transformed[field] = null;
        }
        // If it's already a string, keep it as is
      }
    });

    // Handle nested images relationship
    if (transformed.images !== undefined) {
      if (Array.isArray(transformed.images)) {
        // For updates, we need to use Prisma's nested update syntax
        transformed.images = {
          deleteMany: {}, // Delete all existing images
          create: transformed.images.map((image: any) => ({
            url: image.url,
            altText: image.altText || null,
            isMain: image.isMain || false,
            isHover: image.isHover || false,
            sortOrder: image.sortOrder || 0,
          }))
        };
      } else if (transformed.images === null) {
        // If null, delete all images
        transformed.images = {
          deleteMany: {}
        };
      }
    }

    return transformed;
  }

  async deleteProduct(id: string) {
    return this.prismaService.product.delete({
      where: { id },
    });
  }
}
