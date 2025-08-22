import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminGuard } from '../../dashboard/guards/admin.guard';
import { AdminOnly } from '../../dashboard/decorators/admin-only.decorator';
import { AdminCategoriesService } from './admin-categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@ApiTags('Admin - Categories')
@Controller('admin/categories')
@UseGuards(AdminGuard)
@AdminOnly()
@ApiBearerAuth()
export class AdminCategoriesController {
  constructor(private readonly adminCategoriesService: AdminCategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieve all categories with hierarchical structure and product counts',
  })
  @ApiQuery({ name: 'includeProducts', required: false, type: 'boolean', description: 'Include product counts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories retrieved successfully',
  })
  async getAllCategories(@Query('includeProducts') includeProducts?: boolean) {
    const categories = await this.adminCategoriesService.getAllCategories(includeProducts);
    return {
      success: true,
      data: categories,
      message: 'Categories retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieve detailed category information including products',
  })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category retrieved successfully',
  })
  async getCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    const category = await this.adminCategoriesService.getCategoryById(id);
    return {
      success: true,
      data: category,
      message: 'Category retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create new category',
    description: 'Create a new category with optional parent relationship',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully',
  })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.adminCategoriesService.createCategory(createCategoryDto);
    return {
      success: true,
      data: category,
      message: 'Category created successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update category',
    description: 'Update existing category information',
  })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category updated successfully',
  })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    const category = await this.adminCategoriesService.updateCategory(id, updateCategoryDto);
    return {
      success: true,
      data: category,
      message: 'Category updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete category',
    description: 'Delete category and handle products reassignment',
  })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category deleted successfully',
  })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    await this.adminCategoriesService.deleteCategory(id);
    return {
      success: true,
      message: 'Category deleted successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('analytics/overview')
  @ApiOperation({
    summary: 'Get categories analytics',
    description: 'Get comprehensive analytics for categories',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics retrieved successfully',
  })
  async getCategoriesAnalytics() {
    const analytics = await this.adminCategoriesService.getCategoriesAnalytics();
    return {
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}