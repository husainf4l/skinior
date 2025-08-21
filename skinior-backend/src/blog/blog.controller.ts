import { Controller, Get, Query } from '@nestjs/common';
import { BlogPostsService } from './posts/blog-posts.service';
import { BlogPostSearchDto } from './posts/dto/blog-post.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Public()
  @Get('search')
  search(@Query() searchDto: BlogPostSearchDto) {
    return {
      data: this.blogPostsService.search(searchDto),
    };
  }
}