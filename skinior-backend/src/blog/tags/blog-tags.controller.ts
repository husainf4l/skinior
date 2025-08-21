import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BlogTagsService } from './blog-tags.service';
import { CreateBlogTagDto, UpdateBlogTagDto } from './dto/blog-tag.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('blog/tags')
export class BlogTagsController {
  constructor(private readonly blogTagsService: BlogTagsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBlogTagDto: CreateBlogTagDto) {
    return {
      data: this.blogTagsService.create(createBlogTagDto),
    };
  }

  @Public()
  @Get()
  findAll() {
    return {
      data: this.blogTagsService.findAll(),
    };
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      data: this.blogTagsService.findOne(id),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogTagDto: UpdateBlogTagDto) {
    return {
      data: this.blogTagsService.update(id, updateBlogTagDto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogTagsService.remove(id);
  }
}