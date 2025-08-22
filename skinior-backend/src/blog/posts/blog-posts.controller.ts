import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
  BlogPostQueryDto,
  BlogPostSearchDto,
} from './dto/blog-post.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('blog/posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return {
      data: await this.blogPostsService.create(createBlogPostDto),
    };
  }

  @Public()
  @Get()
  async findAll(@Query() query: BlogPostQueryDto) {
    return {
      data: await this.blogPostsService.findAll(query),
    };
  }

  @Public()
  @Get('featured')
  async findFeatured(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 5;
    return {
      data: await this.blogPostsService.findFeatured(limitNum),
    };
  }

  @Public()
  @Get('search')
  async search(@Query() searchDto: BlogPostSearchDto) {
    return {
      data: await this.blogPostsService.search(searchDto),
    };
  }

  @Public()
  @Get('stats')
  async getStats() {
    return {
      data: await this.blogPostsService.getStats(),
    };
  }

  @Public()
  @Get('slug/:slug')
  async findBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: 'en' | 'ar',
  ) {
    return {
      data: await this.blogPostsService.findBySlug(slug, locale || 'en'),
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.blogPostsService.findOne(id),
    };
  }

  @Public()
  @Get(':id/related')
  async findRelated(@Param('id') id: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 3;
    return {
      data: await this.blogPostsService.findRelated(id, limitNum),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return {
      data: await this.blogPostsService.update(id, updateBlogPostDto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.blogPostsService.remove(id);
    return { success: true };
  }

  @Public()
  @Post(':id/views')
  async incrementViews(@Param('id') id: string) {
    await this.blogPostsService.incrementViews(id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likePost(@Param('id') id: string, @Request() req: any) {
    return {
      data: await this.blogPostsService.likePost(id, req.user.id),
    };
  }
}