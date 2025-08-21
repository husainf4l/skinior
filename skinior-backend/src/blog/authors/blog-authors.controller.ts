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
import { BlogAuthorsService } from './blog-authors.service';
import { CreateBlogAuthorDto, UpdateBlogAuthorDto } from './dto/blog-author.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('blog/authors')
export class BlogAuthorsController {
  constructor(private readonly blogAuthorsService: BlogAuthorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBlogAuthorDto: CreateBlogAuthorDto) {
    return {
      data: this.blogAuthorsService.create(createBlogAuthorDto),
    };
  }

  @Public()
  @Get()
  findAll() {
    return {
      data: this.blogAuthorsService.findAll(),
    };
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      data: this.blogAuthorsService.findOne(id),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogAuthorDto: UpdateBlogAuthorDto) {
    return {
      data: this.blogAuthorsService.update(id, updateBlogAuthorDto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogAuthorsService.remove(id);
  }
}