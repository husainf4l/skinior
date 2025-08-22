import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryFilterDto, UpdateProductDto } from '../dto/dashboard.dto';

@Injectable()
export class DashboardInventoryService {
  constructor(private prisma: PrismaService) {}

  async getProducts(filters: InventoryFilterDto) {
    const { page = 1, limit = 10, search, categoryId, brandId, stockStatus, isActive } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAr: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (stockStatus) {
      switch (stockStatus) {
        case 'out_of_stock':
          where.stockQuantity = 0;
          break;
        case 'low_stock':
          where.stockQuantity = { gt: 0, lt: 10 };
          break;
        case 'in_stock':
          where.stockQuantity = { gte: 10 };
          break;
      }
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
          images: { where: { isMain: true }, take: 1 },
          _count: {
            select: {
              reviews: true,
              cartItems: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map(product => ({
        ...product,
        mainImage: product.images[0]?.url || null,
        reviewCount: product._count.reviews,
        cartItemCount: product._count.cartItems,
        stockStatus: this.getStockStatus(product.stockQuantity),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            reviews: true,
            cartItems: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const averageRating = await this.prisma.productReview.aggregate({
      where: { productId: id, isPublished: true },
      _avg: { rating: true },
    });

    return {
      ...product,
      averageRating: averageRating._avg.rating || 0,
      stockStatus: this.getStockStatus(product.stockQuantity),
    };
  }

  async updateProduct(id: string, updateData: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateData.slug && updateData.slug !== existingProduct.slug) {
      const existingSlug = await this.prisma.product.findUnique({
        where: { slug: updateData.slug },
      });
      if (existingSlug) {
        throw new Error('Slug already exists');
      }
    }

    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: updateData.sku },
      });
      if (existingSku) {
        throw new Error('SKU already exists');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async updateStock(id: string, stockQuantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.update({
      where: { id },
      data: { stockQuantity },
    });
  }

  async bulkUpdateStock(updates: Array<{ id: string; stockQuantity: number }>) {
    const results = await Promise.allSettled(
      updates.map(update => this.updateStock(update.id, update.stockQuantity))
    );

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    return {
      successful,
      failed,
      total: updates.length,
    };
  }

  async getLowStockProducts(threshold = 10) {
    return this.prisma.product.findMany({
      where: {
        stockQuantity: { lt: threshold },
        isActive: true,
      },
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
      },
      orderBy: { stockQuantity: 'asc' },
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getBrands() {
    return this.prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getInventorySummary() {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      outOfStock,
      lowStock,
      totalValue,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { isActive: false } }),
      this.prisma.product.count({ where: { stockQuantity: 0 } }),
      this.prisma.product.count({ where: { stockQuantity: { gt: 0, lt: 10 } } }),
      this.prisma.product.aggregate({
        _sum: {
          price: true,
        },
        where: { isActive: true },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      outOfStock,
      lowStock,
      inStock: activeProducts - outOfStock - lowStock,
      totalValue: totalValue._sum.price || 0,
    };
  }

  private getStockStatus(stockQuantity: number): string {
    if (stockQuantity === 0) return 'out_of_stock';
    if (stockQuantity < 10) return 'low_stock';
    return 'in_stock';
  }
}