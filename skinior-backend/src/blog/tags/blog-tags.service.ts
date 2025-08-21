import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogTagDto, UpdateBlogTagDto } from './dto/blog-tag.dto';

@Injectable()
export class BlogTagsService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '') // Keep Arabic characters
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private formatTag(tag: any) {
    return {
      id: tag.id,
      name: {
        en: tag.nameEn,
        ar: tag.nameAr,
      },
      slug: {
        en: tag.slugEn,
        ar: tag.slugAr,
      },
    };
  }

  async create(createBlogTagDto: CreateBlogTagDto) {
    const slugEn = this.generateSlug(createBlogTagDto.nameEn);
    const slugAr = this.generateSlug(createBlogTagDto.nameAr);

    // Check for slug conflicts
    const existingTag = await this.prisma.blogTag.findFirst({
      where: {
        OR: [
          { slugEn },
          { slugAr },
        ],
      },
    });

    if (existingTag) {
      throw new ConflictException('A tag with this slug already exists');
    }

    const tag = await this.prisma.blogTag.create({
      data: {
        ...createBlogTagDto,
        slugEn,
        slugAr,
      },
    });

    return this.formatTag(tag);
  }

  async findAll() {
    const tags = await this.prisma.blogTag.findMany({
      orderBy: {
        nameEn: 'asc',
      },
    });

    return tags.map(tag => this.formatTag(tag));
  }

  async findOne(id: string) {
    const tag = await this.prisma.blogTag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return this.formatTag(tag);
  }

  async update(id: string, updateBlogTagDto: UpdateBlogTagDto) {
    const existingTag = await this.prisma.blogTag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      throw new NotFoundException('Tag not found');
    }

    const updateData: any = { ...updateBlogTagDto };

    // Generate new slugs if names are updated
    if (updateBlogTagDto.nameEn) {
      updateData.slugEn = this.generateSlug(updateBlogTagDto.nameEn);
    }
    if (updateBlogTagDto.nameAr) {
      updateData.slugAr = this.generateSlug(updateBlogTagDto.nameAr);
    }

    const tag = await this.prisma.blogTag.update({
      where: { id },
      data: updateData,
    });

    return this.formatTag(tag);
  }

  async remove(id: string) {
    const tag = await this.prisma.blogTag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    if (tag._count.posts > 0) {
      throw new ConflictException('Cannot delete tag with existing posts');
    }

    await this.prisma.blogTag.delete({
      where: { id },
    });
  }
}