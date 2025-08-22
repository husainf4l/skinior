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
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../../dashboard/guards/admin.guard';
import { AdminOnly } from '../../dashboard/decorators/admin-only.decorator';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto, ProductImageUploadDto } from '../dto/product.dto';
import { ExcelImportService } from '../services/excel-import.service';

@ApiTags('Admin - Products')
@Controller('admin/products')
@UseGuards(AdminGuard)
@AdminOnly()
@ApiBearerAuth()
export class AdminProductsController {
  constructor(
    private readonly adminProductsService: AdminProductsService,
    private readonly excelImportService: ExcelImportService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products with admin filters',
    description: 'Retrieve all products with advanced filtering, pagination, and admin-specific data',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title, brand, or SKU' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'brand', required: false, description: 'Filter by brand ID' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'all'], example: 'active' })
  @ApiQuery({ name: 'featured', required: false, type: 'boolean' })
  @ApiQuery({ name: 'inStock', required: false, type: 'boolean' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
  })
  async getAllProducts(@Query() filters: ProductFilterDto) {
    const result = await this.adminProductsService.getAllProducts(filters);
    return {
      success: true,
      data: result,
      message: 'Products retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve detailed product information including all admin data',
  })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async getProductById(@Param('id', ParseUUIDPipe) id: string) {
    const product = await this.adminProductsService.getProductById(id);
    return {
      success: true,
      data: product,
      message: 'Product retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create new product',
    description: 'Create a new product with complete details',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid product data',
  })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.adminProductsService.createProduct(createProductDto);
    return {
      success: true,
      data: product,
      message: 'Product created successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update product',
    description: 'Update existing product with new data',
  })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    const product = await this.adminProductsService.updateProduct(id, updateProductDto);
    return {
      success: true,
      data: product,
      message: 'Product updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product',
    description: 'Permanently delete a product and its associated images from AWS S3',
  })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    await this.adminProductsService.deleteProduct(id);
    return {
      success: true,
      message: 'Product deleted successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/images/upload')
  @ApiOperation({
    summary: 'Upload product images',
    description: 'Upload multiple images for a product to AWS S3',
  })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        isMain: {
          type: 'array',
          items: {
            type: 'boolean',
          },
          description: 'Array indicating which images are main images',
        },
        altTexts: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Alt texts for images',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 images
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Images uploaded successfully',
  })
  async uploadProductImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() uploadData: ProductImageUploadDto
  ) {
    if (!images || images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    const result = await this.adminProductsService.uploadProductImages(id, images, uploadData);
    return {
      success: true,
      data: result,
      message: 'Images uploaded successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/images/:imageId/main')
  @ApiOperation({
    summary: 'Set image as main',
    description: 'Set a specific image as the main product image',
  })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiParam({ name: 'imageId', description: 'Image UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Main image updated successfully',
  })
  async setMainImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageId', ParseUUIDPipe) imageId: string
  ) {
    await this.adminProductsService.setMainImage(id, imageId);
    return {
      success: true,
      message: 'Main image updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id/images/:imageId')
  @ApiOperation({
    summary: 'Delete product image',
    description: 'Delete a specific image from product and AWS S3',
  })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiParam({ name: 'imageId', description: 'Image UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image deleted successfully',
  })
  async deleteProductImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageId', ParseUUIDPipe) imageId: string
  ) {
    await this.adminProductsService.deleteProductImage(id, imageId);
    return {
      success: true,
      message: 'Image deleted successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('presigned-upload')
  @ApiOperation({
    summary: 'Generate presigned upload URL',
    description: 'Generate presigned URL for client-side image uploads to AWS S3',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileName: { type: 'string', example: 'product-image.jpg' },
        contentType: { type: 'string', example: 'image/jpeg' },
      },
      required: ['fileName', 'contentType'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Presigned URL generated successfully',
  })
  async generatePresignedUploadUrl(
    @Body() body: { fileName: string; contentType: string }
  ) {
    const result = await this.adminProductsService.generatePresignedUploadUrl(
      body.fileName,
      body.contentType
    );
    return {
      success: true,
      data: result,
      message: 'Presigned URL generated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('bulk-action')
  @ApiOperation({
    summary: 'Bulk actions on products',
    description: 'Perform bulk actions like activate, deactivate, delete, or update category',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
        action: {
          type: 'string',
          enum: ['activate', 'deactivate', 'delete', 'updateCategory', 'updateBrand'],
        },
        value: {
          type: 'string',
          description: 'Value for the action (e.g., category ID for updateCategory)',
        },
      },
      required: ['productIds', 'action'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bulk action completed successfully',
  })
  async bulkAction(
    @Body() body: { productIds: string[]; action: string; value?: string }
  ) {
    const result = await this.adminProductsService.bulkAction(
      body.productIds,
      body.action,
      body.value
    );
    return {
      success: true,
      data: result,
      message: 'Bulk action completed successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('analytics/overview')
  @ApiOperation({
    summary: 'Get products analytics overview',
    description: 'Get comprehensive analytics for products including sales, views, and performance metrics',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics retrieved successfully',
  })
  async getProductsAnalytics() {
    const analytics = await this.adminProductsService.getProductsAnalytics();
    return {
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('import/template')
  @ApiOperation({
    summary: 'Download Excel import template',
    description: 'Download an Excel template file for mass product import',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Excel template downloaded successfully',
    headers: {
      'Content-Type': {
        description: 'Excel file type',
        schema: { type: 'string', example: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      },
      'Content-Disposition': {
        description: 'File attachment',
        schema: { type: 'string', example: 'attachment; filename=products_import_template.xlsx' }
      }
    }
  })
  async downloadImportTemplate(@Query('response') response: any) {
    const templateBuffer = this.excelImportService.generateTemplate();
    
    return {
      success: true,
      data: {
        filename: 'products_import_template.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: templateBuffer.toString('base64'),
      },
      message: 'Template generated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('import/validate')
  @ApiOperation({
    summary: 'Validate Excel file for import',
    description: 'Upload and validate an Excel file without importing the data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel file (.xlsx or .xls)',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File validated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file or validation errors',
  })
  async validateImportFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Excel file is required');
    }

    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      throw new BadRequestException('Only Excel files (.xlsx, .xls) are allowed');
    }

    try {
      // Parse the Excel file
      const products = this.excelImportService.parseExcelFile(file.buffer);
      
      // Validate the data
      const validation = this.excelImportService.validateProducts(products);
      
      return {
        success: true,
        data: {
          totalRows: products.length,
          validRows: validation.validRows.length,
          invalidRows: validation.invalidRows.length,
          validation: {
            isValid: validation.isValid,
            errors: validation.errors,
            warnings: validation.warnings,
            invalidRows: validation.invalidRows,
          },
          sampleValidData: validation.validRows.slice(0, 3), // Show first 3 valid rows as preview
        },
        message: validation.isValid 
          ? 'File validated successfully. Ready for import.' 
          : `File validation failed with ${validation.errors.length} errors`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to process Excel file: ${error.message}`);
    }
  }

  @Post('import/execute')
  @ApiOperation({
    summary: 'Execute mass product import from Excel',
    description: 'Upload and import products from an Excel file',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel file (.xlsx or .xls)',
        },
        skipValidation: {
          type: 'boolean',
          description: 'Skip validation and force import (use with caution)',
          default: false,
        },
        createMissingCategories: {
          type: 'boolean',
          description: 'Create categories that don\'t exist',
          default: true,
        },
        createMissingBrands: {
          type: 'boolean',
          description: 'Create brands that don\'t exist',
          default: true,
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Products imported successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Import failed due to validation errors',
  })
  async executeImport(
    @UploadedFile() file: Express.Multer.File,
    @Body() options: {
      skipValidation?: boolean;
      createMissingCategories?: boolean;
      createMissingBrands?: boolean;
    }
  ) {
    if (!file) {
      throw new BadRequestException('Excel file is required');
    }

    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      throw new BadRequestException('Only Excel files (.xlsx, .xls) are allowed');
    }

    try {
      // Parse the Excel file
      const products = this.excelImportService.parseExcelFile(file.buffer);
      
      // Validate unless explicitly skipped
      if (!options.skipValidation) {
        const validation = this.excelImportService.validateProducts(products);
        
        if (!validation.isValid) {
          return {
            success: false,
            data: {
              validation,
              message: 'Import cancelled due to validation errors. Fix the errors and try again, or use skipValidation=true to force import.',
            },
            message: `Validation failed with ${validation.errors.length} errors`,
            timestamp: new Date().toISOString(),
          };
        }
      }
      
      // Execute the import
      const importResult = await this.adminProductsService.importProductsFromExcel(
        products,
        {
          createMissingCategories: options.createMissingCategories !== false,
          createMissingBrands: options.createMissingBrands !== false,
        }
      );
      
      return {
        success: true,
        data: importResult,
        message: `Import completed successfully. ${importResult.successCount} products imported, ${importResult.failureCount} failed.`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to import products: ${error.message}`);
    }
  }

  @Get('import/history')
  @ApiOperation({
    summary: 'Get import history',
    description: 'Get history of mass product imports',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Import history retrieved successfully',
  })
  async getImportHistory(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20'
  ) {
    const history = await this.adminProductsService.getImportHistory(
      parseInt(page),
      parseInt(limit)
    );
    
    return {
      success: true,
      data: history,
      message: 'Import history retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}