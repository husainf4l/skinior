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
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostsService.create(createBlogPostDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: BlogPostQueryDto) {
    return {
      data: this.blogPostsService.findAll(query),
    };
  }

  @Public()
  @Get('featured')
  findFeatured(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 5;
    return {
      data: this.blogPostsService.findFeatured(limitNum),
    };
  }

  @Public()
  @Get('search')
  search(@Query() searchDto: BlogPostSearchDto) {
    return {
      data: this.blogPostsService.search(searchDto),
    };
  }

  @Public()
  @Get('stats')
  getStats() {
    return {
      data: this.blogPostsService.getStats(),
    };
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: 'en' | 'ar',
  ) {
    return {
      data: this.blogPostsService.findBySlug(slug, locale || 'en'),
    };
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      data: this.blogPostsService.findOne(id),
    };
  }

  @Public()
  @Get(':id/related')
  findRelated(@Param('id') id: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 3;
    return {
      data: this.blogPostsService.findRelated(id, limitNum),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return {
      data: this.blogPostsService.update(id, updateBlogPostDto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogPostsService.remove(id);
  }

  @Public()
  @Post(':id/views')
  incrementViews(@Param('id') id: string) {
    this.blogPostsService.incrementViews(id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likePost(@Param('id') id: string, @Request() req: any) {
    return {
      data: this.blogPostsService.likePost(id, req.user.id),
    };
  }
}