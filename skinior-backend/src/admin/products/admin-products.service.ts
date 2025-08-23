import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AwsService } from '../services/aws.service';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductFilterDto, 
  ProductImageUploadDto 
} from '../dto/product.dto';
import { ExcelProductRow } from '../services/excel-import.service';

@Injectable()
export class AdminProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly awsService: AwsService
  ) {}

  async getAllProducts(filters: ProductFilterDto) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      brand,
      status = 'all',
      featured,
      inStock,
    } = filters;

    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (status !== 'all') {
      where.isActive = status === 'active';
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAr: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    
    if (category) {
      where.categoryId = category;
    }
    
    if (brand) {
      where.brandId = brand;
    }
    
    if (featured !== undefined) {
      where.isFeatured = featured;
    }
    
    if (inStock !== undefined) {
      if (inStock) {
        where.stockQuantity = { gt: 0 };
      } else {
        where.stockQuantity = { lte: 0 };
      }
    }

    // Execute query
    const [products, total] = await Promise.all([
      this.prismaService.product.findMany({
        where,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          category: true,
          brand: true,
          reviews: {
            where: { isPublished: true },
            select: { rating: true },
          },
          cartItems: {
            select: { id: true },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      this.prismaService.product.count({ where }),
    ]);

    // Enhance products with analytics
    const enhancedProducts = products.map(product => {
      const averageRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;

      return {
        ...product,
        analytics: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: product.reviews.length,
          inCartCount: product.cartItems.length,
          isInStock: product.stockQuantity > 0,
          mainImage: product.images.find(img => img.isMain)?.url || product.images[0]?.url,
        },
      };
    });

    return {
      products: enhancedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
        brand: true,
        reviews: {
          where: { isPublished: true },
          include: {
            // Include review details for admin view
          },
        },
        cartItems: {
          select: { id: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Calculate analytics
    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    return {
      ...product,
      analytics: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: product.reviews.length,
        inCartCount: product.cartItems.length,
        isInStock: product.stockQuantity > 0,
        viewCount: product.viewCount,
        salesCount: product.salesCount,
      },
      parsedFields: {
        features: this.parseJsonField(product.features),
        featuresAr: this.parseJsonField(product.featuresAr),
        ingredients: this.parseJsonField(product.ingredients),
        ingredientsAr: this.parseJsonField(product.ingredientsAr),
        concerns: this.parseJsonField(product.concerns),
      },
    };
  }

  async createProduct(createProductDto: CreateProductDto) {
    // Generate unique slug
    const baseSlug = this.generateSlug(createProductDto.title);
    const slug = await this.ensureUniqueSlug(baseSlug);

    // Transform data for database
    const productData = {
      ...createProductDto,
      slug,
      features: createProductDto.features ? JSON.stringify(createProductDto.features) : null,
      featuresAr: createProductDto.featuresAr ? JSON.stringify(createProductDto.featuresAr) : null,
      ingredients: createProductDto.ingredients ? JSON.stringify(createProductDto.ingredients) : null,
      ingredientsAr: createProductDto.ingredientsAr ? JSON.stringify(createProductDto.ingredientsAr) : null,
      concerns: createProductDto.concerns ? JSON.stringify(createProductDto.concerns) : null,
    };

    try {
      const product = await this.prismaService.product.create({
        data: productData,
        include: {
          images: true,
          category: true,
          brand: true,
        },
      });

      return product;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Product with this SKU or slug already exists');
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Handle slug update if title changed
    let slug = existingProduct.slug;
    if (updateProductDto.title && updateProductDto.title !== existingProduct.title) {
      const baseSlug = this.generateSlug(updateProductDto.title);
      slug = await this.ensureUniqueSlug(baseSlug, id);
    }

    // Transform data for database
    const updateData: any = {
      ...updateProductDto,
      slug,
    };

    // Handle JSON fields
    if (updateProductDto.features !== undefined) {
      updateData.features = updateProductDto.features ? JSON.stringify(updateProductDto.features) : null;
    }
    if (updateProductDto.featuresAr !== undefined) {
      updateData.featuresAr = updateProductDto.featuresAr ? JSON.stringify(updateProductDto.featuresAr) : null;
    }
    if (updateProductDto.ingredients !== undefined) {
      updateData.ingredients = updateProductDto.ingredients ? JSON.stringify(updateProductDto.ingredients) : null;
    }
    if (updateProductDto.ingredientsAr !== undefined) {
      updateData.ingredientsAr = updateProductDto.ingredientsAr ? JSON.stringify(updateProductDto.ingredientsAr) : null;
    }
    if (updateProductDto.concerns !== undefined) {
      updateData.concerns = updateProductDto.concerns ? JSON.stringify(updateProductDto.concerns) : null;
    }

    try {
      const product = await this.prismaService.product.update({
        where: { id },
        data: updateData,
        include: {
          images: true,
          category: true,
          brand: true,
        },
      });

      return product;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Product with this SKU or slug already exists');
      }
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async deleteProduct(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    try {
      // Delete images from AWS S3
      if (product.images.length > 0) {
        const imageUrls = product.images.map(img => img.url);
        await this.awsService.deleteMultipleFiles(imageUrls);
      }

      // Delete product from database (this will cascade delete images due to schema)
      await this.prismaService.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product');
    }
  }

  async deleteAllProducts(productIds?: string[]): Promise<{ deletedCount: number; deletedImageCount: number }> {
    try {
      // Build where clause based on whether specific IDs are provided
      const whereClause = productIds && productIds.length > 0 
        ? { id: { in: productIds } } 
        : {};

      // First, get products with their images (either all or specific ones)
      const products = await this.prismaService.product.findMany({
        where: whereClause,
        include: {
          images: true,
        },
      });

      if (products.length === 0) {
        return { deletedCount: 0, deletedImageCount: 0 };
      }

      // Collect all image URLs for AWS S3 deletion
      const allImageUrls: string[] = [];
      products.forEach(product => {
        product.images.forEach(image => {
          allImageUrls.push(image.url);
        });
      });

      // Delete all images from AWS S3 if there are any
      if (allImageUrls.length > 0) {
        await this.awsService.deleteMultipleFiles(allImageUrls);
      }

      // Delete products from database (this will cascade delete images, attributes, etc.)
      const deleteResult = await this.prismaService.product.deleteMany({
        where: whereClause,
      });

      return {
        deletedCount: deleteResult.count,
        deletedImageCount: allImageUrls.length,
      };
    } catch (error) {
      const operation = productIds && productIds.length > 0 
        ? `delete ${productIds.length} products` 
        : 'delete all products';
      throw new InternalServerErrorException(`Failed to ${operation}: ${error.message}`);
    }
  }

  async uploadProductImages(
    productId: string,
    images: Express.Multer.File[],
    uploadData: ProductImageUploadDto
  ) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    try {
      // Upload images to AWS S3
      const imageUrls = await this.awsService.uploadMultipleFiles(images, 'products');

      // Create image records in database
      const imageData = images.map((file, index) => ({
        productId,
        url: imageUrls[index],
        altText: uploadData.altTexts?.[index] || `${product.title} - Image ${index + 1}`,
        isMain: uploadData.isMain?.[index] || false,
        sortOrder: index,
      }));

      // If this is the first main image, ensure only one main image exists
      if (imageData.some(img => img.isMain)) {
        await this.prismaService.productImage.updateMany({
          where: { productId, isMain: true },
          data: { isMain: false },
        });
      }

      const createdImages = await this.prismaService.productImage.createMany({
        data: imageData,
      });

      // Get the created images with full data
      const newImages = await this.prismaService.productImage.findMany({
        where: {
          productId,
          url: { in: imageUrls },
        },
        orderBy: { sortOrder: 'asc' },
      });

      return {
        uploadedCount: images.length,
        images: newImages,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload product images');
    }
  }

  async setMainImage(productId: string, imageId: string) {
    // Verify product and image exist
    const image = await this.prismaService.productImage.findFirst({
      where: { id: imageId, productId },
    });

    if (!image) {
      throw new NotFoundException('Image not found for this product');
    }

    try {
      await this.prismaService.$transaction([
        // Remove main flag from all images of this product
        this.prismaService.productImage.updateMany({
          where: { productId, isMain: true },
          data: { isMain: false },
        }),
        // Set the specified image as main
        this.prismaService.productImage.update({
          where: { id: imageId },
          data: { isMain: true },
        }),
      ]);
    } catch (error) {
      throw new InternalServerErrorException('Failed to set main image');
    }
  }

  async deleteProductImage(productId: string, imageId: string) {
    const image = await this.prismaService.productImage.findFirst({
      where: { id: imageId, productId },
    });

    if (!image) {
      throw new NotFoundException('Image not found for this product');
    }

    try {
      // Delete from AWS S3
      await this.awsService.deleteFile(image.url);

      // Delete from database
      await this.prismaService.productImage.delete({
        where: { id: imageId },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product image');
    }
  }

  async generatePresignedUploadUrl(fileName: string, contentType: string) {
    return this.awsService.generatePresignedUploadUrl(fileName, contentType, 'products');
  }

  async bulkAction(productIds: string[], action: string, value?: string) {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const productId of productIds) {
      try {
        switch (action) {
          case 'activate':
            await this.prismaService.product.update({
              where: { id: productId },
              data: { isActive: true },
            });
            break;
          case 'deactivate':
            await this.prismaService.product.update({
              where: { id: productId },
              data: { isActive: false },
            });
            break;
          case 'delete':
            await this.deleteProduct(productId);
            break;
          case 'updateCategory':
            if (!value) throw new Error('Category ID is required');
            await this.prismaService.product.update({
              where: { id: productId },
              data: { categoryId: value },
            });
            break;
          case 'updateBrand':
            if (!value) throw new Error('Brand ID is required');
            await this.prismaService.product.update({
              where: { id: productId },
              data: { brandId: value },
            });
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Product ${productId}: ${error.message}`);
      }
    }

    return results;
  }

  async getProductsAnalytics() {
    const [
      totalProducts,
      activeProducts,
      inStockProducts,
      featuredProducts,
      categoriesCount,
      brandsCount,
      totalValue,
      lowStockProducts,
    ] = await Promise.all([
      this.prismaService.product.count(),
      this.prismaService.product.count({ where: { isActive: true } }),
      this.prismaService.product.count({ where: { stockQuantity: { gt: 0 } } }),
      this.prismaService.product.count({ where: { isFeatured: true } }),
      this.prismaService.category.count(),
      this.prismaService.brand.count(),
      this.prismaService.product.aggregate({
        _sum: { price: true },
        where: { isActive: true },
      }),
      this.prismaService.product.count({
        where: { stockQuantity: { lte: 10, gt: 0 }, isActive: true },
      }),
    ]);

    // Get top performing products
    const topProducts = await this.prismaService.product.findMany({
      where: { isActive: true },
      orderBy: [
        { salesCount: 'desc' },
        { viewCount: 'desc' },
      ],
      take: 10,
      select: {
        id: true,
        title: true,
        salesCount: true,
        viewCount: true,
        price: true,
        images: {
          where: { isMain: true },
          select: { url: true },
        },
      },
    });

    return {
      overview: {
        totalProducts,
        activeProducts,
        inactiveProducts: totalProducts - activeProducts,
        inStockProducts,
        outOfStockProducts: totalProducts - inStockProducts,
        featuredProducts,
        totalValue: totalValue._sum.price || 0,
        lowStockProducts,
      },
      categories: {
        total: categoriesCount,
      },
      brands: {
        total: brandsCount,
      },
      topProducts,
    };
  }

  async importProductsFromExcel(
    products: ExcelProductRow[], 
    options: { createMissingCategories: boolean; createMissingBrands: boolean }
  ) {
    const results = {
      successCount: 0,
      failureCount: 0,
      errors: [] as string[],
      created: [] as string[],
      skipped: [] as string[],
      categoriesCreated: [] as string[],
      brandsCreated: [] as string[],
    };

    // Create import log entry
    const importLog = await this.prismaService.importLog.create({
      data: {
        fileName: 'excel-import.xlsx',
        totalRows: products.length,
        status: 'processing',
        metadata: {
          options,
          startTime: new Date().toISOString(),
        },
      },
    });

    try {
      // First, collect all unique categories and brands
      const uniqueCategories = new Set(
        products
          .map(p => p.categoryName)
          .filter(name => name && name.trim())
      );
      
      const uniqueBrands = new Set(
        products
          .map(p => p.brandName)
          .filter(name => name && name.trim())
      );

      // Create missing categories and brands in separate transactions
      const categoryMap = new Map<string, string>();
      const brandMap = new Map<string, string>();

      // Handle categories
      if (options.createMissingCategories) {
        for (const categoryName of uniqueCategories) {
          if (!categoryName) continue;
          
          try {
            const existing = await this.prismaService.category.findFirst({
              where: { name: { equals: categoryName, mode: 'insensitive' } },
            });
            
            if (existing) {
              categoryMap.set(categoryName, existing.id);
            } else {
              const slug = this.generateSlug(categoryName);
              const uniqueSlug = await this.ensureUniqueCategorySlug(slug);
              
              const newCategory = await this.prismaService.category.create({
                data: {
                  name: categoryName,
                  slug: uniqueSlug,
                },
              });
              
              categoryMap.set(categoryName, newCategory.id);
              results.categoriesCreated.push(categoryName);
            }
          } catch (error) {
            console.warn(`Failed to create category ${categoryName}:`, error.message);
          }
        }
      } else {
        // Just map existing categories
        const validCategories = Array.from(uniqueCategories).filter(Boolean) as string[];
        const existingCategories = await this.prismaService.category.findMany({
          where: { 
            name: { in: validCategories, mode: 'insensitive' } 
          },
        });
        
        existingCategories.forEach(cat => {
          const matchingName = validCategories.find(
            name => name && name.toLowerCase() === cat.name.toLowerCase()
          );
          if (matchingName) {
            categoryMap.set(matchingName, cat.id);
          }
        });
      }

      // Handle brands
      if (options.createMissingBrands) {
        for (const brandName of uniqueBrands) {
          if (!brandName) continue;
          
          try {
            const existing = await this.prismaService.brand.findFirst({
              where: { name: { equals: brandName, mode: 'insensitive' } },
            });
            
            if (existing) {
              brandMap.set(brandName, existing.id);
            } else {
              const slug = this.generateSlug(brandName);
              const uniqueSlug = await this.ensureUniqueBrandSlug(slug);
              
              const newBrand = await this.prismaService.brand.create({
                data: {
                  name: brandName,
                  slug: uniqueSlug,
                },
              });
              
              brandMap.set(brandName, newBrand.id);
              results.brandsCreated.push(brandName);
            }
          } catch (error) {
            console.warn(`Failed to create brand ${brandName}:`, error.message);
          }
        }
      } else {
        // Just map existing brands
        const validBrands = Array.from(uniqueBrands).filter(Boolean) as string[];
        const existingBrands = await this.prismaService.brand.findMany({
          where: { 
            name: { in: validBrands, mode: 'insensitive' } 
          },
        });
        
        existingBrands.forEach(brand => {
          const matchingName = validBrands.find(
            name => name && name.toLowerCase() === brand.name.toLowerCase()
          );
          if (matchingName) {
            brandMap.set(matchingName, brand.id);
          }
        });
      }

      // Now import products individually (each in its own transaction)
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        try {
          await this.prismaService.$transaction(async (tx) => {
            // Check if product already exists by SKU or title
            let existingProduct: any = null;
            if (product.sku) {
              existingProduct = await tx.product.findFirst({
                where: { sku: product.sku },
              });
            }
            
            if (!existingProduct && product.title) {
              existingProduct = await tx.product.findFirst({
                where: { title: { equals: product.title, mode: 'insensitive' } },
              });
            }

            if (existingProduct) {
              results.skipped.push(`Row ${i + 2}: Product already exists (SKU: ${product.sku || 'N/A'}, Title: ${product.title})`);
              return;
            }

            // Generate unique slug
            const baseSlug = this.generateSlug(product.title || `product-${i}`);
            const slug = await this.ensureUniqueSlugWithTx(baseSlug, tx);

            // Prepare product data
            const productData: any = {
              title: product.title,
              titleAr: product.titleAr || null,
              slug,
              descriptionEn: product.descriptionEn || null,
              descriptionAr: product.descriptionAr || null,
              price: product.price || 0,
              compareAtPrice: product.compareAtPrice || null,
              currency: product.currency || 'JOD',
              sku: product.sku || null,
              barcode: product.barcode || null,
              isActive: product.isActive !== undefined ? product.isActive : true,
              isFeatured: product.isFeatured || false,
              isNew: product.isNew || false,
              stockQuantity: product.stockQuantity || 0,
              activeIngredients: product.activeIngredients || null,
              skinType: product.skinType || null,
              usage: product.usage || null,
              concerns: product.concerns ? JSON.stringify(product.concerns.split(',').map(s => s.trim())) : null,
              features: product.features ? JSON.stringify(product.features.split(',').map(s => s.trim())) : null,
              ingredients: product.ingredients ? JSON.stringify(product.ingredients.split(',').map(s => s.trim())) : null,
              howToUse: product.howToUse || null,
              featuresAr: product.featuresAr ? JSON.stringify(product.featuresAr.split(',').map(s => s.trim())) : null,
              ingredientsAr: product.ingredientsAr ? JSON.stringify(product.ingredientsAr.split(',').map(s => s.trim())) : null,
              howToUseAr: product.howToUseAr || null,
              metaTitle: product.metaTitle || null,
              metaDescription: product.metaDescription || null,
              categoryId: product.categoryName ? categoryMap.get(product.categoryName) || null : null,
              brandId: product.brandName ? brandMap.get(product.brandName) || null : null,
            };

            // Create the product
            const createdProduct = await tx.product.create({
              data: productData,
            });

            // Handle image URLs if provided
            if (product.imageUrls) {
              const imageUrls = product.imageUrls.split(',').map(url => url.trim()).filter(url => url);
              
              for (let j = 0; j < imageUrls.length; j++) {
                const imageUrl = imageUrls[j];
                
                try {
                  await tx.productImage.create({
                    data: {
                      productId: createdProduct.id,
                      url: imageUrl,
                      altText: `${product.title} - Image ${j + 1}`,
                      isMain: j === 0, // First image is main
                      sortOrder: j,
                    },
                  });
                } catch (imageError) {
                  console.warn(`Failed to add image ${imageUrl} for product ${createdProduct.id}:`, imageError);
                }
              }
            }

            // Handle product attributes if provided
            if (product.attributes) {
              const attributePairs = product.attributes.split(',').map(attr => attr.trim()).filter(attr => attr);
              
              for (const attrPair of attributePairs) {
                const [attrName, attrValue] = attrPair.split(':').map(s => s.trim());
                if (attrName && attrValue) {
                  try {
                    // Find or create attribute
                    let attribute = await tx.productAttribute.findFirst({
                      where: { name: { equals: attrName, mode: 'insensitive' } },
                    });
                    
                    if (!attribute) {
                      const attrSlug = this.generateSlug(attrName);
                      attribute = await tx.productAttribute.create({
                        data: {
                          name: attrName,
                          slug: attrSlug,
                        },
                      });
                    }

                    // Find or create attribute value
                    let attributeValue = await tx.productAttributeValue.findFirst({
                      where: {
                        attributeId: attribute.id,
                        value: { equals: attrValue, mode: 'insensitive' },
                      },
                    });
                    
                    if (!attributeValue) {
                      const valueSlug = this.generateSlug(attrValue);
                      attributeValue = await tx.productAttributeValue.create({
                        data: {
                          attributeId: attribute.id,
                          value: attrValue,
                          slug: valueSlug,
                        },
                      });
                    }

                    // Link product to attribute value
                    await tx.productAttribute_Product.create({
                      data: {
                        productId: createdProduct.id,
                        productAttributeValueId: attributeValue.id,
                      },
                    });
                  } catch (attrError) {
                    console.warn(`Failed to add attribute ${attrName}:${attrValue} for product ${createdProduct.id}:`, attrError);
                  }
                }
              }
            }

            results.created.push(`Row ${i + 2}: ${product.title} (ID: ${createdProduct.id})`);
            results.successCount++;
          });
        } catch (error) {
          results.failureCount++;
          results.errors.push(`Row ${i + 2}: ${error.message}`);
          console.error(`Failed to import product at row ${i + 2}:`, error);
        }
      }

      // Update import log
      await this.prismaService.importLog.update({
        where: { id: importLog.id },
        data: {
          status: 'completed',
          processedRows: results.successCount + results.failureCount,
          successRows: results.successCount,
          errorRows: results.failureCount,
          completedAt: new Date(),
          metadata: {
            ...(importLog.metadata as any || {}),
            endTime: new Date().toISOString(),
            results,
          },
        },
      });
    } catch (error) {
      // Update import log with error
      await this.prismaService.importLog.update({
        where: { id: importLog.id },
        data: {
          status: 'failed',
          errorRows: results.failureCount,
          errors: [error.message],
          completedAt: new Date(),
          metadata: {
            ...(importLog.metadata as any || {}),
            endTime: new Date().toISOString(),
            results,
          },
        },
      });
      
      throw error;
    }

    return results;
  }

  async getImportHistory(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [imports, total] = await Promise.all([
      this.prismaService.importLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaService.importLog.count(),
    ]);

    return {
      imports: imports.map(log => ({
        id: log.id,
        fileName: log.fileName,
        status: log.status,
        totalRecords: log.totalRows,
        successCount: log.successRows,
        failureCount: log.errorRows,
        errorMessage: Array.isArray(log.errors) && log.errors.length > 0 ? log.errors[0] : null,
        createdAt: log.createdAt,
        completedAt: log.completedAt,
        metadata: log.metadata,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  private async ensureUniqueCategorySlug(baseSlug: string, tx?: any): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    const prisma = tx || this.prismaService;

    while (true) {
      const existing = await prisma.category.findFirst({
        where: { slug },
      });

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  private async ensureUniqueBrandSlug(baseSlug: string, tx?: any): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    const prisma = tx || this.prismaService;

    while (true) {
      const existing = await prisma.brand.findFirst({
        where: { slug },
      });

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  private async ensureUniqueSlugWithTx(baseSlug: string, tx: any, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await tx.product.findFirst({
        where: {
          slug,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  // Helper methods
  private parseJsonField(field: any): any {
    if (field == null) return null;
    if (Array.isArray(field)) return field;
    if (typeof field === 'object') return field;
    if (typeof field === 'string') {
      const trimmed = field.trim();
      if (trimmed === '') return null;
      
      try {
        return JSON.parse(trimmed);
      } catch {
        if (trimmed.includes(',')) {
          return trimmed.split(',').map(s => s.trim()).filter(Boolean);
        }
        return [trimmed];
      }
    }
    return field;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.prismaService.product.findFirst({
        where: {
          slug,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
}