import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AwsService } from '../services/aws.service';
import { CreateBrandDto, UpdateBrandDto } from '../dto/brand.dto';

@Injectable()
export class AdminBrandsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly awsService: AwsService
  ) {}

  async getAllBrands() {
    const brands = await this.prismaService.brand.findMany({
      include: {
        _count: {
          select: {
            products: { where: { isActive: true } },
          },
        },
      },
      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' },
      ],
    });

    return brands.map(brand => ({
      ...brand,
      analytics: {
        totalProducts: brand._count.products,
        isActive: brand.isActive,
      },
    }));
  }

  async getBrandById(id: string) {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: {
              where: { isMain: true },
              select: { url: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            products: { where: { isActive: true } },
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    // Calculate total value of products
    const totalValue = brand.products.reduce((sum, product) => sum + product.price, 0);

    return {
      ...brand,
      analytics: {
        totalProducts: brand._count.products,
        totalValue,
        recentProducts: brand.products,
      },
    };
  }

  async createBrand(createBrandDto: CreateBrandDto) {
    // Generate unique slug
    const baseSlug = this.generateSlug(createBrandDto.name);
    const slug = await this.ensureUniqueSlug(baseSlug);

    try {
      const brand = await this.prismaService.brand.create({
        data: {
          ...createBrandDto,
          slug,
        },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });

      return brand;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Brand with this name or slug already exists');
      }
      throw new InternalServerErrorException('Failed to create brand');
    }
  }

  async updateBrand(id: string, updateBrandDto: UpdateBrandDto) {
    const existingBrand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    // Handle slug update if name changed
    let slug = existingBrand.slug;
    if (updateBrandDto.name && updateBrandDto.name !== existingBrand.name) {
      const baseSlug = this.generateSlug(updateBrandDto.name);
      slug = await this.ensureUniqueSlug(baseSlug, id);
    }

    try {
      const brand = await this.prismaService.brand.update({
        where: { id },
        data: {
          ...updateBrandDto,
          slug,
        },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });

      return brand;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Brand with this name or slug already exists');
      }
      throw new InternalServerErrorException('Failed to update brand');
    }
  }

  async deleteBrand(id: string) {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    try {
      await this.prismaService.$transaction(async (tx) => {
        // Update products to have no brand
        if (brand.products.length > 0) {
          await tx.product.updateMany({
            where: { brandId: id },
            data: { brandId: null },
          });
        }

        // Delete brand logo from AWS S3 if exists
        if (brand.logo) {
          await this.awsService.deleteFile(brand.logo);
        }

        // Delete the brand
        await tx.brand.delete({
          where: { id },
        });
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete brand');
    }
  }

  async uploadBrandLogo(id: string, logo: Express.Multer.File) {
    if (!logo) {
      throw new BadRequestException('Logo file is required');
    }

    const brand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    try {
      // Delete old logo if exists
      if (brand.logo) {
        await this.awsService.deleteFile(brand.logo);
      }

      // Upload new logo
      const logoUrl = await this.awsService.uploadFile(logo, 'brands');

      // Update brand with new logo URL
      const updatedBrand = await this.prismaService.brand.update({
        where: { id },
        data: { logo: logoUrl },
      });

      return {
        logoUrl: updatedBrand.logo,
        message: 'Logo uploaded successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload brand logo');
    }
  }

  async deleteBrandLogo(id: string) {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    if (!brand.logo) {
      throw new BadRequestException('Brand has no logo to delete');
    }

    try {
      // Delete logo from AWS S3
      await this.awsService.deleteFile(brand.logo);

      // Update brand to remove logo URL
      await this.prismaService.brand.update({
        where: { id },
        data: { logo: null },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete brand logo');
    }
  }

  async getBrandsAnalytics() {
    const [
      totalBrands,
      activeBrands,
      brandsWithProducts,
      emptyBrandsCount,
    ] = await Promise.all([
      this.prismaService.brand.count(),
      this.prismaService.brand.count({ where: { isActive: true } }),
      this.prismaService.brand.count({
        where: { products: { some: { isActive: true } } },
      }),
      this.prismaService.brand.count({
        where: { products: { none: {} } },
      }),
    ]);

    // Get brands with product counts
    const brandsWithCounts = await this.prismaService.brand.findMany({
      include: {
        _count: {
          select: {
            products: { where: { isActive: true } },
          },
        },
      },
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    return {
      overview: {
        totalBrands,
        activeBrands,
        inactiveBrands: totalBrands - activeBrands,
        brandsWithProducts,
        emptyBrands: emptyBrandsCount,
      },
      topBrands: brandsWithCounts.map(brand => ({
        id: brand.id,
        name: brand.name,
        nameAr: brand.nameAr,
        productCount: brand._count.products,
        hasLogo: !!brand.logo,
        isActive: brand.isActive,
      })),
    };
  }

  // Helper methods
  private generateSlug(name: string): string {
    return name
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
      const existing = await this.prismaService.brand.findFirst({
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