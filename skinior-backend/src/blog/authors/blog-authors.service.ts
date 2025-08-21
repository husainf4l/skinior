import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogAuthorDto, UpdateBlogAuthorDto } from './dto/blog-author.dto';

@Injectable()
export class BlogAuthorsService {
  constructor(private prisma: PrismaService) {}

  private formatAuthor(author: any) {
    return {
      id: author.id,
      name: {
        en: author.nameEn,
        ar: author.nameAr,
      },
      avatar: author.avatar,
      bio: {
        en: author.bioEn,
        ar: author.bioAr,
      },
      email: author.email,
      socialLinks: author.socialLinks,
    };
  }

  async create(createBlogAuthorDto: CreateBlogAuthorDto) {
    const author = await this.prisma.blogAuthor.create({
      data: createBlogAuthorDto,
    });

    return this.formatAuthor(author);
  }

  async findAll() {
    const authors = await this.prisma.blogAuthor.findMany({
      orderBy: {
        nameEn: 'asc',
      },
    });

    return authors.map(author => this.formatAuthor(author));
  }

  async findOne(id: string) {
    const author = await this.prisma.blogAuthor.findUnique({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return this.formatAuthor(author);
  }

  async update(id: string, updateBlogAuthorDto: UpdateBlogAuthorDto) {
    const existingAuthor = await this.prisma.blogAuthor.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      throw new NotFoundException('Author not found');
    }

    const author = await this.prisma.blogAuthor.update({
      where: { id },
      data: updateBlogAuthorDto,
    });

    return this.formatAuthor(author);
  }

  async remove(id: string) {
    const author = await this.prisma.blogAuthor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    if (author._count.posts > 0) {
      throw new ConflictException('Cannot delete author with existing posts');
    }

    await this.prisma.blogAuthor.delete({
      where: { id },
    });
  }
}