import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

import { AdminProductsController } from './products/admin-products.controller';
import { AdminProductsService } from './products/admin-products.service';
import { AdminCategoriesController } from './categories/admin-categories.controller';
import { AdminCategoriesService } from './categories/admin-categories.service';
import { AdminBrandsController } from './brands/admin-brands.controller';
import { AdminBrandsService } from './brands/admin-brands.service';
import { AdminUsersController } from './users/admin-users.controller';
import { AdminUsersService } from './users/admin-users.service';
import { AdminOrdersController } from './orders/admin-orders.controller';
import { AdminOrdersService } from './orders/admin-orders.service';
import { AdminAnalyticsController } from './analytics/admin-analytics.controller';
import { AdminAnalyticsService } from './analytics/admin-analytics.service';
import { AwsService } from './services/aws.service';
import { ExcelImportService } from './services/excel-import.service';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [
    AdminProductsController,
    AdminCategoriesController,
    AdminBrandsController,
    AdminUsersController,
    AdminOrdersController,
    AdminAnalyticsController,
  ],
  providers: [
    AdminProductsService,
    AdminCategoriesService,
    AdminBrandsService,
    AdminUsersService,
    AdminOrdersService,
    AdminAnalyticsService,
    AwsService,
    ExcelImportService,
  ],
  exports: [
    AdminProductsService,
    AdminCategoriesService,
    AdminBrandsService,
    AdminUsersService,
    AdminOrdersService,
    AdminAnalyticsService,
    AwsService,
  ],
})
export class AdminModule {}