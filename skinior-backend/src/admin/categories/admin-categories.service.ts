import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class AdminCategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCategories(includeProducts: boolean = false) {
    const categories = await this.prismaService.category.findMany({
      include: {
        parent: true,
        children: true,
        ...(includeProducts && {
          products: {
            where: { isActive: true },
            select: { id: true, title: true, price: true, stockQuantity: true },
          },
        }),
        _count: {
          select: {
            products: { where: { isActive: true } },
            children: true,
          },
        },
      },
      orderBy: [
        { parent: { name: 'asc' } },
        { name: 'asc' },
      ],
    });

    // Build hierarchical structure
    const rootCategories = categories.filter(cat => !cat.parentId);
    const buildHierarchy = (parentCategories: any[]) => {
      return parentCategories.map(parent => ({
        ...parent,
        children: buildHierarchy(categories.filter(cat => cat.parentId === parent.id)),
      }));
    };

    return buildHierarchy(rootCategories);
  }

  async getCategoryById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          include: {
            _count: {
              select: { products: { where: { isActive: true } } },
            },
          },
        },
        products: {
          where: { isActive: true },
          include: {
            images: {
              where: { isMain: true },
              select: { url: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            products: { where: { isActive: true } },
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return {
      ...category,
      analytics: {
        totalProducts: category._count.products,
        totalSubcategories: category._count.children,
        recentProducts: category.products,
      },
    };
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    // Generate unique slug (using single slug field from schema)
    const baseSlug = this.generateSlug(createCategoryDto.nameEn || createCategoryDto.name);
    const slug = await this.ensureUniqueSlug(baseSlug);

    // Validate parent category exists if provided
    if (createCategoryDto.parentId) {
      const parentCategory = await this.prismaService.category.findUnique({
        where: { id: createCategoryDto.parentId },
      });
      
      if (!parentCategory) {
        throw new BadRequestException('Parent category does not exist');
      }
    }

    try {
      const category = await this.prismaService.category.create({
        data: {
          name: createCategoryDto.nameEn || createCategoryDto.name,
          nameAr: createCategoryDto.nameAr,
          description: createCategoryDto.descriptionEn,
          slug,
          parentId: createCategoryDto.parentId,
        },
        include: {
          parent: true,
          children: true,
          _count: {
            select: { products: true },
          },
        },
      });

      return category;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Category with this name or slug already exists');
      }
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Prevent circular references in parent-child relationship
    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      // Check if the new parent is a descendant of this category
      const isDescendant = await this.isDescendant(id, updateCategoryDto.parentId);
      if (isDescendant) {
        throw new BadRequestException('Cannot set descendant as parent - would create circular reference');
      }
    }

    // Handle slug updates if names changed
    let slug = existingCategory.slug;

    if (updateCategoryDto.nameEn && updateCategoryDto.nameEn !== existingCategory.name) {
      const baseSlug = this.generateSlug(updateCategoryDto.nameEn);
      slug = await this.ensureUniqueSlug(baseSlug, id);
    }

    try {
      const category = await this.prismaService.category.update({
        where: { id },
        data: {
          ...(updateCategoryDto.nameEn && { name: updateCategoryDto.nameEn }),
          ...(updateCategoryDto.nameAr && { nameAr: updateCategoryDto.nameAr }),
          ...(updateCategoryDto.descriptionEn && { description: updateCategoryDto.descriptionEn }),
          ...(updateCategoryDto.parentId !== undefined && { parentId: updateCategoryDto.parentId }),
          slug,
        },
        include: {
          parent: true,
          children: true,
          _count: {
            select: { products: true },
          },
        },
      });

      return category;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Category with this name or slug already exists');
      }
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async deleteCategory(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    try {
      await this.prismaService.$transaction(async (tx) => {
        // Update child categories to have no parent
        if (category.children.length > 0) {
          await tx.category.updateMany({
            where: { parentId: id },
            data: { parentId: null },
          });
        }

        // Update products to have no category
        if (category.products.length > 0) {
          await tx.product.updateMany({
            where: { categoryId: id },
            data: { categoryId: null },
          });
        }

        // Delete the category
        await tx.category.delete({
          where: { id },
        });
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete category');
    }
  }

  async getCategoriesAnalytics() {
    const [
      totalCategories,
      rootCategories,
      subcategories,
      categoriesWithProducts,
      emptyCategoriesCount,
    ] = await Promise.all([
      this.prismaService.category.count(),
      this.prismaService.category.count({ where: { parentId: null } }),
      this.prismaService.category.count({ where: { parentId: { not: null } } }),
      this.prismaService.category.count({
        where: { products: { some: { isActive: true } } },
      }),
      this.prismaService.category.count({
        where: { products: { none: {} } },
      }),
    ]);

    // Get categories with product counts
    const categoriesWithCounts = await this.prismaService.category.findMany({
      include: {
        _count: {
          select: {
            products: { where: { isActive: true } },
          },
        },
      },
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    return {
      overview: {
        totalCategories,
        rootCategories,
        subcategories,
        categoriesWithProducts,
        emptyCategories: emptyCategoriesCount,
      },
      topCategories: categoriesWithCounts.map(cat => ({
        id: cat.id,
        name: cat.name,
        nameAr: cat.nameAr,
        productCount: cat._count.products,
      })),
    };
  }

  // Helper methods
  private async isDescendant(ancestorId: string, descendantId: string): Promise<boolean> {
    const descendant = await this.prismaService.category.findUnique({
      where: { id: descendantId },
      include: { parent: true },
    });

    if (!descendant || !descendant.parent) {
      return false;
    }

    if (descendant.parent.id === ancestorId) {
      return true;
    }

    return this.isDescendant(ancestorId, descendant.parent.id);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.prismaService.category.findFirst({
        where: {
          slug,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
}