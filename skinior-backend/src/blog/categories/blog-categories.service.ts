import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto/blog-category.dto';

@Injectable()
export class BlogCategoriesService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '') // Keep Arabic characters
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private formatCategory(category: any) {
    return {
      id: category.id,
      name: {
        en: category.nameEn,
        ar: category.nameAr,
      },
      slug: {
        en: category.slugEn,
        ar: category.slugAr,
      },
      description: {
        en: category.descriptionEn,
        ar: category.descriptionAr,
      },
      color: category.color,
    };
  }

  async create(createBlogCategoryDto: CreateBlogCategoryDto) {
    const slugEn = this.generateSlug(createBlogCategoryDto.nameEn);
    const slugAr = this.generateSlug(createBlogCategoryDto.nameAr);

    // Check for slug conflicts
    const existingCategory = await this.prisma.blogCategory.findFirst({
      where: {
        OR: [
          { slugEn },
          { slugAr },
        ],
      },
    });

    if (existingCategory) {
      throw new ConflictException('A category with this slug already exists');
    }

    const category = await this.prisma.blogCategory.create({
      data: {
        ...createBlogCategoryDto,
        slugEn,
        slugAr,
      },
    });

    return this.formatCategory(category);
  }

  async findAll() {
    const categories = await this.prisma.blogCategory.findMany({
      orderBy: {
        nameEn: 'asc',
      },
    });

    return categories.map(category => this.formatCategory(category));
  }

  async findOne(id: string) {
    const category = await this.prisma.blogCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.formatCategory(category);
  }

  async update(id: string, updateBlogCategoryDto: UpdateBlogCategoryDto) {
    const existingCategory = await this.prisma.blogCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const updateData: any = { ...updateBlogCategoryDto };

    // Generate new slugs if names are updated
    if (updateBlogCategoryDto.nameEn) {
      updateData.slugEn = this.generateSlug(updateBlogCategoryDto.nameEn);
    }
    if (updateBlogCategoryDto.nameAr) {
      updateData.slugAr = this.generateSlug(updateBlogCategoryDto.nameAr);
    }

    const category = await this.prisma.blogCategory.update({
      where: { id },
      data: updateData,
    });

    return this.formatCategory(category);
  }

  async remove(id: string) {
    const category = await this.prisma.blogCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.posts > 0) {
      throw new ConflictException('Cannot delete category with existing posts');
    }

    await this.prisma.blogCategory.delete({
      where: { id },
    });
  }
}