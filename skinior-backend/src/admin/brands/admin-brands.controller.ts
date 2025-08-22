import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../../dashboard/guards/admin.guard';
import { AdminOnly } from '../../dashboard/decorators/admin-only.decorator';
import { AdminBrandsService } from './admin-brands.service';
import { CreateBrandDto, UpdateBrandDto } from '../dto/brand.dto';

@ApiTags('Admin - Brands')
@Controller('admin/brands')
@UseGuards(AdminGuard)
@AdminOnly()
@ApiBearerAuth()
export class AdminBrandsController {
  constructor(private readonly adminBrandsService: AdminBrandsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all brands',
    description: 'Retrieve all brands with product counts and analytics',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brands retrieved successfully',
  })
  async getAllBrands() {
    const brands = await this.adminBrandsService.getAllBrands();
    return {
      success: true,
      data: brands,
      message: 'Brands retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get brand by ID',
    description: 'Retrieve detailed brand information including products',
  })
  @ApiParam({ name: 'id', description: 'Brand UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand retrieved successfully',
  })
  async getBrandById(@Param('id', ParseUUIDPipe) id: string) {
    const brand = await this.adminBrandsService.getBrandById(id);
    return {
      success: true,
      data: brand,
      message: 'Brand retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create new brand',
    description: 'Create a new brand with optional logo upload',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Brand created successfully',
  })
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    const brand = await this.adminBrandsService.createBrand(createBrandDto);
    return {
      success: true,
      data: brand,
      message: 'Brand created successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update brand',
    description: 'Update existing brand information',
  })
  @ApiParam({ name: 'id', description: 'Brand UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand updated successfully',
  })
  async updateBrand(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto
  ) {
    const brand = await this.adminBrandsService.updateBrand(id, updateBrandDto);
    return {
      success: true,
      data: brand,
      message: 'Brand updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete brand',
    description: 'Delete brand and handle products reassignment',
  })
  @ApiParam({ name: 'id', description: 'Brand UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand deleted successfully',
  })
  async deleteBrand(@Param('id', ParseUUIDPipe) id: string) {
    await this.adminBrandsService.deleteBrand(id);
    return {
      success: true,
      message: 'Brand deleted successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/logo')
  @ApiOperation({
    summary: 'Upload brand logo',
    description: 'Upload or update brand logo image to AWS S3',
  })
  @ApiParam({ name: 'id', description: 'Brand UUID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logo uploaded successfully',
  })
  async uploadBrandLogo(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() logo: Express.Multer.File
  ) {
    const result = await this.adminBrandsService.uploadBrandLogo(id, logo);
    return {
      success: true,
      data: result,
      message: 'Logo uploaded successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id/logo')
  @ApiOperation({
    summary: 'Delete brand logo',
    description: 'Delete brand logo from AWS S3',
  })
  @ApiParam({ name: 'id', description: 'Brand UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logo deleted successfully',
  })
  async deleteBrandLogo(@Param('id', ParseUUIDPipe) id: string) {
    await this.adminBrandsService.deleteBrandLogo(id);
    return {
      success: true,
      message: 'Logo deleted successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('analytics/overview')
  @ApiOperation({
    summary: 'Get brands analytics',
    description: 'Get comprehensive analytics for brands',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics retrieved successfully',
  })
  async getBrandsAnalytics() {
    const analytics = await this.adminBrandsService.getBrandsAnalytics();
    return {
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}