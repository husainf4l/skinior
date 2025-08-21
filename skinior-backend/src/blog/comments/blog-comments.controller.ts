import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogCommentsService } from './blog-comments.service';
import { CreateBlogCommentDto } from './dto/blog-comment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('blog/posts/:postId/comments')
export class BlogCommentsController {
  constructor(private readonly blogCommentsService: BlogCommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('postId') postId: string,
    @Body() createBlogCommentDto: CreateBlogCommentDto,
    @Request() req: any,
  ) {
    return {
      data: this.blogCommentsService.create(postId, createBlogCommentDto, req.user),
    };
  }

  @Public()
  @Get()
  findByPost(@Param('postId') postId: string) {
    return {
      data: this.blogCommentsService.findByPost(postId),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.blogCommentsService.remove(id, req.user.id);
  }

  @Public()
  @Post(':id/like')
  likeComment(@Param('id') id: string) {
    return {
      data: this.blogCommentsService.likeComment(id),
    };
  }
}