import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogPostDto, UpdateBlogPostDto, BlogPostQueryDto, BlogPostSearchDto, BlogPostResponseDto } from './dto/blog-post.dto';

@Injectable()
export class BlogPostsService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '') // Keep Arabic characters
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private calculateReadTime(content: string, locale: 'en' | 'ar' = 'en'): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    
    if (locale === 'ar') {
      return `${minutes} دقائق قراءة`;
    }
    return `${minutes} min read`;
  }

  private formatBlogPost(post: any): BlogPostResponseDto {
    return {
      id: post.id,
      title: {
        en: post.titleEn,
        ar: post.titleAr,
      },
      slug: {
        en: post.slugEn,
        ar: post.slugAr,
      },
      excerpt: {
        en: post.excerptEn,
        ar: post.excerptAr,
      },
      content: {
        en: post.contentEn,
        ar: post.contentAr,
      },
      featuredImage: post.featuredImage,
      images: post.images,
      publishedAt: post.publishedAt?.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      readTime: {
        en: post.readTimeEn,
        ar: post.readTimeAr,
      },
      category: post.category ? {
        id: post.category.id,
        name: {
          en: post.category.nameEn,
          ar: post.category.nameAr,
        },
        slug: {
          en: post.category.slugEn,
          ar: post.category.slugAr,
        },
        description: {
          en: post.category.descriptionEn,
          ar: post.category.descriptionAr,
        },
        color: post.category.color,
      } : null,
      author: post.author ? {
        id: post.author.id,
        name: {
          en: post.author.nameEn,
          ar: post.author.nameAr,
        },
        avatar: post.author.avatar,
        bio: {
          en: post.author.bioEn,
          ar: post.author.bioAr,
        },
        email: post.author.email,
        socialLinks: post.author.socialLinks,
      } : null,
      tags: post.tags?.map((postTag: any) => ({
        id: postTag.tag.id,
        name: {
          en: postTag.tag.nameEn,
          ar: postTag.tag.nameAr,
        },
        slug: {
          en: postTag.tag.slugEn,
          ar: postTag.tag.slugAr,
        },
      })) || [],
      featured: post.featured,
      published: post.published,
      seoTitle: post.seoTitleEn || post.seoTitleAr ? {
        en: post.seoTitleEn,
        ar: post.seoTitleAr,
      } : undefined,
      seoDescription: post.seoDescriptionEn || post.seoDescriptionAr ? {
        en: post.seoDescriptionEn,
        ar: post.seoDescriptionAr,
      } : undefined,
      views: post.views,
      likes: post.likes,
      commentsCount: post.commentsCount,
    };
  }

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPostResponseDto> {
    const slugEn = this.generateSlug(createBlogPostDto.titleEn);
    const slugAr = this.generateSlug(createBlogPostDto.titleAr);

    // Check for slug conflicts
    const existingPost = await this.prisma.blogPost.findFirst({
      where: {
        OR: [
          { slugEn },
          { slugAr },
        ],
      },
    });

    if (existingPost) {
      throw new ConflictException('A post with this slug already exists');
    }

    const readTimeEn = this.calculateReadTime(createBlogPostDto.contentEn, 'en');
    const readTimeAr = this.calculateReadTime(createBlogPostDto.contentAr, 'ar');

    const post = await this.prisma.blogPost.create({
      data: {
        ...createBlogPostDto,
        slugEn,
        slugAr,
        readTimeEn,
        readTimeAr,
        publishedAt: createBlogPostDto.published ? new Date() : null,
      },
      include: {
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Handle tags
    if (createBlogPostDto.tagIds && createBlogPostDto.tagIds.length > 0) {
      await this.prisma.blogPostTag.createMany({
        data: createBlogPostDto.tagIds.map(tagId => ({
          postId: post.id,
          tagId,
        })),
      });

      // Refetch with tags
      const postWithTags = await this.prisma.blogPost.findUnique({
        where: { id: post.id },
        include: {
          category: true,
          author: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return this.formatBlogPost(postWithTags);
    }

    return this.formatBlogPost(post);
  }

  async findAll(query: BlogPostQueryDto) {
    const where: any = {};

    if (query.category) {
      where.categoryId = query.category;
    }

    if (query.author) {
      where.authorId = query.author;
    }

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    if (query.published !== undefined) {
      where.published = query.published;
    } else {
      where.published = true; // Default to published only
    }

    if (query.search) {
      where.OR = [
        { titleEn: { contains: query.search, mode: 'insensitive' } },
        { titleAr: { contains: query.search, mode: 'insensitive' } },
        { contentEn: { contains: query.search, mode: 'insensitive' } },
        { contentAr: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.tag) {
      where.tags = {
        some: {
          tagId: query.tag,
        },
      };
    }

    // Handle date range filtering
    if (query.dateRangeStart || query.dateRangeEnd) {
      where.publishedAt = {};
      if (query.dateRangeStart) {
        where.publishedAt.gte = new Date(query.dateRangeStart);
      }
      if (query.dateRangeEnd) {
        where.publishedAt.lte = new Date(query.dateRangeEnd);
      }
    } else if (query.dateRange) {
      try {
        const dateRange = JSON.parse(query.dateRange);
        if (dateRange.start || dateRange.end) {
          where.publishedAt = {};
          if (dateRange.start) {
            where.publishedAt.gte = new Date(dateRange.start);
          }
          if (dateRange.end) {
            where.publishedAt.lte = new Date(dateRange.end);
          }
        }
      } catch (error) {
        // Invalid JSON, ignore date range filter
      }
    }

    // Handle read time range filtering
    // Note: This is a basic implementation - for more precise filtering,
    // you'd need to calculate actual read times and store them as numbers
    if (query.readTimeMin !== undefined || query.readTimeMax !== undefined) {
      const readTimeConditions: any[] = [];
      
      if (query.readTimeMin !== undefined) {
        // Approximate filter based on content length
        const minWords = query.readTimeMin * 200; // 200 words per minute
        readTimeConditions.push({
          OR: [
            { contentEn: { not: null }, AND: [{ contentEn: { length: { gte: minWords * 5 } } }] }, // ~5 chars per word
            { contentAr: { not: null }, AND: [{ contentAr: { length: { gte: minWords * 5 } } }] },
          ],
        });
      }
      
      if (query.readTimeMax !== undefined) {
        const maxWords = query.readTimeMax * 200;
        readTimeConditions.push({
          OR: [
            { contentEn: { not: null }, AND: [{ contentEn: { length: { lte: maxWords * 5 } } }] },
            { contentAr: { not: null }, AND: [{ contentAr: { length: { lte: maxWords * 5 } } }] },
          ],
        });
      }
      
      if (readTimeConditions.length > 0) {
        where.AND = where.AND ? [...where.AND, ...readTimeConditions] : readTimeConditions;
      }
    } else if (query.readTimeRange) {
      try {
        const readTimeRange = JSON.parse(query.readTimeRange);
        if (readTimeRange.min !== undefined || readTimeRange.max !== undefined) {
          const readTimeConditions: any[] = [];
          
          if (readTimeRange.min !== undefined) {
            const minWords = readTimeRange.min * 200;
            readTimeConditions.push({
              OR: [
                { contentEn: { not: null }, AND: [{ contentEn: { length: { gte: minWords * 5 } } }] },
                { contentAr: { not: null }, AND: [{ contentAr: { length: { gte: minWords * 5 } } }] },
              ],
            });
          }
          
          if (readTimeRange.max !== undefined) {
            const maxWords = readTimeRange.max * 200;
            readTimeConditions.push({
              OR: [
                { contentEn: { not: null }, AND: [{ contentEn: { length: { lte: maxWords * 5 } } }] },
                { contentAr: { not: null }, AND: [{ contentAr: { length: { lte: maxWords * 5 } } }] },
              ],
            });
          }
          
          if (readTimeConditions.length > 0) {
            where.AND = where.AND ? [...where.AND, ...readTimeConditions] : readTimeConditions;
          }
        }
      } catch (error) {
        // Invalid JSON, ignore read time range filter
      }
    }

    const orderBy: any = {};
    if (query.sortBy === 'title') {
      orderBy.titleEn = query.sortOrder;
    } else if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder;
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        include: {
          category: true,
          author: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy,
        take: query.limit,
        skip: query.offset,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    const [categories, popularTags] = await Promise.all([
      this.prisma.blogCategory.findMany(),
      this.prisma.blogTag.findMany({
        take: 10,
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
      }),
    ]);

    return {
      posts: posts.map(post => this.formatBlogPost(post)),
      total,
      hasMore: ((query.offset || 0) + (query.limit || 10)) < total,
      categories: categories.map(cat => ({
        id: cat.id,
        name: {
          en: cat.nameEn,
          ar: cat.nameAr,
        },
        slug: {
          en: cat.slugEn,
          ar: cat.slugAr,
        },
        description: {
          en: cat.descriptionEn,
          ar: cat.descriptionAr,
        },
        color: cat.color,
      })),
      popularTags: popularTags.map(tag => ({
        id: tag.id,
        name: {
          en: tag.nameEn,
          ar: tag.nameAr,
        },
        slug: {
          en: tag.slugEn,
          ar: tag.slugAr,
        },
      })),
    };
  }

  async findOne(id: string): Promise<BlogPostResponseDto> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return this.formatBlogPost(post);
  }

  async findBySlug(slug: string, locale: 'en' | 'ar' = 'en'): Promise<BlogPostResponseDto> {
    const where = locale === 'en' ? { slugEn: slug } : { slugAr: slug };

    const post = await this.prisma.blogPost.findFirst({
      where,
      include: {
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return this.formatBlogPost(post);
  }

  async findFeatured(limit: number = 5): Promise<BlogPostResponseDto[]> {
    const posts = await this.prisma.blogPost.findMany({
      where: {
        featured: true,
        published: true,
      },
      include: {
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });

    return posts.map(post => this.formatBlogPost(post));
  }

  async search(searchDto: BlogPostSearchDto): Promise<BlogPostResponseDto[]> {
    const where: any = {
      published: true,
      OR: [
        { titleEn: { contains: searchDto.q, mode: 'insensitive' } },
        { titleAr: { contains: searchDto.q, mode: 'insensitive' } },
        { contentEn: { contains: searchDto.q, mode: 'insensitive' } },
        { contentAr: { contains: searchDto.q, mode: 'insensitive' } },
      ],
    };

    const posts = await this.prisma.blogPost.findMany({
      where,
      include: {
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: searchDto.limit,
    });

    return posts.map(post => this.formatBlogPost(post));
  }

  async findRelated(id: string, limit: number = 3): Promise<BlogPostResponseDto[]> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    const tagIds = post.tags.map(pt => pt.tagId);

    const relatedPosts = await this.prisma.blogPost.findMany({
      where: {
        id: { not: id },
        published: true,
        OR: [
          { categoryId: post.categoryId },
          {
            tags: {
              some: {
                tagId: {
                  in: tagIds,
                },
              },
            },
          },
        ],
      },
      include: {
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });

    return relatedPosts.map(post => this.formatBlogPost(post));
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPostResponseDto> {
    const existingPost = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException('Blog post not found');
    }

    const updateData: any = { ...updateBlogPostDto };

    // Generate new slugs if titles are updated
    if (updateBlogPostDto.titleEn) {
      updateData.slugEn = this.generateSlug(updateBlogPostDto.titleEn);
    }
    if (updateBlogPostDto.titleAr) {
      updateData.slugAr = this.generateSlug(updateBlogPostDto.titleAr);
    }

    // Recalculate read time if content is updated
    if (updateBlogPostDto.contentEn) {
      updateData.readTimeEn = this.calculateReadTime(updateBlogPostDto.contentEn, 'en');
    }
    if (updateBlogPostDto.contentAr) {
      updateData.readTimeAr = this.calculateReadTime(updateBlogPostDto.contentAr, 'ar');
    }

    // Set published date when publishing
    if (updateBlogPostDto.published && !existingPost.published) {
      updateData.publishedAt = new Date();
    }

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Handle tag updates
    if (updateBlogPostDto.tagIds !== undefined) {
      // Remove existing tags
      await this.prisma.blogPostTag.deleteMany({
        where: { postId: id },
      });

      // Add new tags
      if (updateBlogPostDto.tagIds.length > 0) {
        await this.prisma.blogPostTag.createMany({
          data: updateBlogPostDto.tagIds.map(tagId => ({
            postId: id,
            tagId,
          })),
        });
      }

      // Refetch with updated tags
      const updatedPost = await this.prisma.blogPost.findUnique({
        where: { id },
        include: {
          category: true,
          author: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return this.formatBlogPost(updatedPost);
    }

    return this.formatBlogPost(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    await this.prisma.blogPost.delete({
      where: { id },
    });
  }

  async incrementViews(id: string): Promise<void> {
    await this.prisma.blogPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  async likePost(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    const existingLike = await this.prisma.blogPostLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await this.prisma.blogPostLike.delete({
        where: { id: existingLike.id },
      });

      await this.prisma.blogPost.update({
        where: { id: postId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });

      const post = await this.prisma.blogPost.findUnique({
        where: { id: postId },
        select: { likes: true },
      });

      return { liked: false, likesCount: post?.likes || 0 };
    } else {
      // Like
      await this.prisma.blogPostLike.create({
        data: {
          postId,
          userId,
        },
      });

      await this.prisma.blogPost.update({
        where: { id: postId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      const post = await this.prisma.blogPost.findUnique({
        where: { id: postId },
        select: { likes: true },
      });

      return { liked: true, likesCount: post?.likes || 0 };
    }
  }

  async getStats() {
    const [totalPosts, totalViews, totalLikes, totalComments] = await Promise.all([
      this.prisma.blogPost.count({ where: { published: true } }),
      this.prisma.blogPost.aggregate({
        where: { published: true },
        _sum: { views: true },
      }),
      this.prisma.blogPost.aggregate({
        where: { published: true },
        _sum: { likes: true },
      }),
      this.prisma.blogComment.count(),
    ]);

    const [popularPosts, recentPosts, topCategories] = await Promise.all([
      this.prisma.blogPost.findMany({
        where: { published: true },
        include: {
          category: true,
          author: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { views: 'desc' },
        take: 5,
      }),
      this.prisma.blogPost.findMany({
        where: { published: true },
        include: {
          category: true,
          author: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        take: 5,
      }),
      this.prisma.blogCategory.findMany({
        include: {
          _count: {
            select: {
              posts: {
                where: { published: true },
              },
            },
          },
        },
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    return {
      totalPosts,
      totalViews: totalViews._sum.views || 0,
      totalLikes: totalLikes._sum.likes || 0,
      totalComments,
      popularPosts: popularPosts.map(post => this.formatBlogPost(post)),
      recentPosts: recentPosts.map(post => this.formatBlogPost(post)),
      topCategories: topCategories.map(cat => ({
        id: cat.id,
        name: {
          en: cat.nameEn,
          ar: cat.nameAr,
        },
        slug: {
          en: cat.slugEn,
          ar: cat.slugAr,
        },
        description: {
          en: cat.descriptionEn,
          ar: cat.descriptionAr,
        },
        color: cat.color,
        postCount: cat._count.posts,
      })),
    };
  }
}