import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductSearchDto, ProductAvailabilityFiltersDto } from './dto/product-search.dto';
import { SyncSkiniorProductsDto, SkiniorProductDto } from './dto/skinior-sync.dto';
import { UpdateProductAvailabilityDto } from './dto/product-availability.dto';

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

  // Enhanced methods for Agent16 integration

  async getAvailableProducts(filters: ProductAvailabilityFiltersDto) {
    const whereClause: any = {
      isActive: true,
    };

    // Apply filters
    if (filters.skinType) {
      whereClause.skinType = {
        contains: filters.skinType,
        mode: 'insensitive',
      };
    }

    if (filters.concerns) {
      const concernsArray = filters.concerns.split(',').map(c => c.trim());
      whereClause.concerns = {
        contains: concernsArray.join('|'), // Use regex-like pattern
        mode: 'insensitive',
      };
    }

    if (filters.budgetRange) {
      const priceRanges = {
        low: { lte: 25 },
        medium: { gte: 25, lte: 75 },
        high: { gte: 75 },
      };
      whereClause.price = priceRanges[filters.budgetRange as keyof typeof priceRanges];
    }

    const products = await this.prismaService.product.findMany({
      where: whereClause,
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
      take: filters.limit,
      skip: filters.offset,
    });

    const total = await this.prismaService.product.count({ where: whereClause });

    return {
      products: this.addProductStats(products).map(p => ({
        id: p.id,
        name: p.title,
        brand: p.brand?.name,
        category: p.category?.name,
        price: p.price,
        rating: p.reviewStats.averageRating,
        availability: p.isInStock,
        skinType: this.parseJsonField(p.skinType),
        concerns: this.parseJsonField(p.concerns),
      })),
      total,
      filtersApplied: filters,
    };
  }

  async getProductDetails(productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
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
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const enhancedProduct = this.addProductStats([product])[0];

    return {
      id: enhancedProduct.id,
      name: enhancedProduct.title,
      brand: enhancedProduct.brand?.name,
      category: enhancedProduct.category?.name,
      description: enhancedProduct.descriptionEn,
      ingredients: this.parseJsonField(enhancedProduct.ingredients) || this.parseJsonField(enhancedProduct.activeIngredients),
      price: enhancedProduct.price,
      currency: enhancedProduct.currency,
      rating: enhancedProduct.reviewStats.averageRating,
      reviewCount: enhancedProduct.reviewStats.totalReviews,
      availability: enhancedProduct.isInStock,
      stockQuantity: enhancedProduct.stockQuantity,
      images: enhancedProduct.images?.map((img: any) => img.url) || [],
      url: `${process.env.FRONTEND_URL || 'https://skinior.com'}/products/${enhancedProduct.slug}`,
      usageInstructions: enhancedProduct.howToUse,
      warnings: this.parseJsonField(enhancedProduct.features)?.filter((f: string) => f.toLowerCase().includes('warning')),
    };
  }

  async searchProductsAdvanced(searchDto: ProductSearchDto) {
    const whereClause: any = {
      isActive: true,
    };

    // Text search
    if (searchDto.query) {
      whereClause.OR = [
        { title: { contains: searchDto.query, mode: 'insensitive' } },
        { titleAr: { contains: searchDto.query, mode: 'insensitive' } },
        { descriptionEn: { contains: searchDto.query, mode: 'insensitive' } },
        { activeIngredients: { contains: searchDto.query, mode: 'insensitive' } },
        { brand: { name: { contains: searchDto.query, mode: 'insensitive' } } },
        { category: { name: { contains: searchDto.query, mode: 'insensitive' } } },
      ];
    }

    // Apply filters
    if (searchDto.category) {
      whereClause.category = {
        name: { equals: searchDto.category, mode: 'insensitive' },
      };
    }

    if (searchDto.brand) {
      whereClause.brand = {
        name: { equals: searchDto.brand, mode: 'insensitive' },
      };
    }

    if (searchDto.priceRange) {
      const priceRanges = {
        low: { lte: 25 },
        medium: { gte: 25, lte: 75 },
        high: { gte: 75 },
      };
      whereClause.price = priceRanges[searchDto.priceRange as keyof typeof priceRanges];
    }

    if (searchDto.availableOnly) {
      whereClause.stockQuantity = { gt: 0 };
    }

    // Build order clause
    let orderBy: any = [];
    switch (searchDto.sortBy) {
      case 'price_asc':
        orderBy = [{ price: 'asc' }];
        break;
      case 'price_desc':
        orderBy = [{ price: 'desc' }];
        break;
      case 'newest':
        orderBy = [{ createdAt: 'desc' }];
        break;
      case 'oldest':
        orderBy = [{ createdAt: 'asc' }];
        break;
      case 'rating_asc':
      case 'rating_desc':
      default:
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
        break;
    }

    const [products, total] = await Promise.all([
      this.prismaService.product.findMany({
        where: whereClause,
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
        orderBy,
        take: searchDto.limit,
        skip: searchDto.offset,
      }),
      this.prismaService.product.count({ where: whereClause }),
    ]);

    let enhancedProducts = this.addProductStats(products);

    // Apply rating filter after fetching (since we calculate rating dynamically)
    if (searchDto.ratingMin) {
      enhancedProducts = enhancedProducts.filter(
        p => p.reviewStats.averageRating >= searchDto.ratingMin!
      );
    }

    // Apply post-fetch sorting for rating-based sorts
    if (searchDto.sortBy === 'rating_desc') {
      enhancedProducts.sort((a, b) => b.reviewStats.averageRating - a.reviewStats.averageRating);
    } else if (searchDto.sortBy === 'rating_asc') {
      enhancedProducts.sort((a, b) => a.reviewStats.averageRating - b.reviewStats.averageRating);
    }

    return {
      products: enhancedProducts,
      total,
      query: searchDto.query,
      filtersApplied: {
        category: searchDto.category,
        priceRange: searchDto.priceRange,
        ratingMin: searchDto.ratingMin,
        brand: searchDto.brand,
        availableOnly: searchDto.availableOnly,
        sortBy: searchDto.sortBy,
      },
    };
  }

  /**
   * Returns products that are on deal today. We consider a product on deal
   * when `compareAtPrice` is set and greater than `price`.
   */
  async getTodayDeals(limit = 20, offset = 0) {
    const products = await this.prismaService.product.findMany({
      where: {
        isActive: true,
        compareAtPrice: {
          gt: 0,
        },
        AND: [
          {
            price: {
              lt: undefined, // placeholder - Prisma doesn't support comparing two fields directly here
            },
          },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        brand: true,
        reviews: { where: { isPublished: true } },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: limit,
      skip: offset,
    });

    // Filter server-side to ensure compareAtPrice > price since Prisma can't compare two columns directly
    const filtered = products.filter(p => (p.compareAtPrice ?? 0) > (p.price ?? 0));

    return this.addProductStats(filtered).map(p => ({
      id: p.id,
      name: p.title,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      discountPercentage: p.compareAtPrice && p.price ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0,
      images: p.images?.map((i: any) => i.url) || [],
      brand: p.brand?.name,
      category: p.category?.name,
      availability: p.isInStock,
    }));
  }

  async syncSkiniorProducts(syncDto: SyncSkiniorProductsDto) {
    try {
      let syncedCount = 0;
      let updatedCount = 0;
      let newCount = 0;
      const errors: string[] = [];

      await this.prismaService.$transaction(async (tx) => {
        for (const productData of syncDto.products) {
          try {
            // Check if product exists by skiniorId (we'll need to add this field to schema)
            const existingProduct = await tx.product.findFirst({
              where: { sku: productData.skiniorId }, // Using SKU as skiniorId for now
            });

            const productPayload = {
              title: productData.name,
              slug: this.generateSlug(productData.name),
              descriptionEn: productData.description,
              price: productData.price || 0,
              currency: productData.currency || 'USD',
              sku: productData.skiniorId,
              isActive: productData.availability ?? true,
              stockQuantity: productData.stockQuantity || 0,
              activeIngredients: productData.ingredients ? JSON.stringify(productData.ingredients) : null,
              skinType: productData.skinType ? JSON.stringify(productData.skinType) : null,
              concerns: productData.concerns ? JSON.stringify(productData.concerns) : null,
              features: productData.tags ? JSON.stringify(productData.tags) : null,
              ingredients: productData.ingredients ? JSON.stringify(productData.ingredients) : null,
              howToUse: productData.usageInstructions,
            };

            if (existingProduct) {
              await tx.product.update({
                where: { id: existingProduct.id },
                data: {
                  ...productPayload,
                  updatedAt: new Date(),
                },
              });
              updatedCount++;
            } else {
              await tx.product.create({
                data: productPayload,
              });
              newCount++;
            }
            syncedCount++;
          } catch (error) {
            errors.push(`Failed to sync product ${productData.skiniorId}: ${error}`);
          }
        }
      });

      return {
        syncedCount,
        updatedCount,
        newCount,
        errors,
        syncTimestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new BadRequestException('Failed to sync Skinior products');
    }
  }

  async updateProductAvailability(productId: string, updateDto: UpdateProductAvailabilityDto) {
    try {
      const existingProduct = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      const updatedProduct = await this.prismaService.product.update({
        where: { id: productId },
        data: {
          isActive: updateDto.availability.available,
          stockQuantity: updateDto.availability.stockQuantity || 0,
          price: updateDto.availability.price || existingProduct.price,
          currency: updateDto.availability.currency || existingProduct.currency,
          updatedAt: new Date(updateDto.updatedAt),
        },
      });

      return {
        id: updatedProduct.id,
        availability: {
          available: updatedProduct.isActive,
          stockQuantity: updatedProduct.stockQuantity,
          price: updatedProduct.price,
          currency: updatedProduct.currency,
          lastChecked: updateDto.availability.lastChecked,
          source: updateDto.availability.source,
        },
        updatedAt: updatedProduct.updatedAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update product availability');
    }
  }

  private parseJsonField(field: any): any {
    if (field == null) return null;
    if (Array.isArray(field)) return field;
    if (typeof field === 'object') return field;
    if (typeof field === 'string') {
      const trimmed = field.trim();
      if (trimmed === '') return null;
      
      try {
        return JSON.parse(trimmed);
      } catch {
        // If not JSON, try comma-separated values
        if (trimmed.includes(',')) {
          return trimmed.split(',').map(s => s.trim()).filter(Boolean);
        }
        return [trimmed];
      }
    }
    return field;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
