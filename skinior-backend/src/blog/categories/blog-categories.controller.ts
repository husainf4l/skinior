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
import { BlogCategoriesService } from './blog-categories.service';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto/blog-category.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('blog/categories')
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    return {
      data: this.blogCategoriesService.create(createBlogCategoryDto),
    };
  }

  @Public()
  @Get()
  findAll() {
    return {
      data: this.blogCategoriesService.findAll(),
    };
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      data: this.blogCategoriesService.findOne(id),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogCategoryDto: UpdateBlogCategoryDto) {
    return {
      data: this.blogCategoriesService.update(id, updateBlogCategoryDto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogCategoriesService.remove(id);
  }
}