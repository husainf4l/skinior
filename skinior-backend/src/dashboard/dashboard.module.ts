import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

import { DashboardAnalyticsController } from './analytics/dashboard-analytics.controller';
import { DashboardAnalyticsService } from './analytics/dashboard-analytics.service';

import { DashboardInventoryController } from './inventory/dashboard-inventory.controller';
import { DashboardInventoryService } from './inventory/dashboard-inventory.service';

import { DashboardCustomersController } from './customers/dashboard-customers.controller';
import { DashboardCustomersService } from './customers/dashboard-customers.service';

import { DashboardOrdersController } from './orders/dashboard-orders.controller';
import { DashboardOrdersService } from './orders/dashboard-orders.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    DashboardAnalyticsController,
    DashboardInventoryController,
    DashboardCustomersController,
    DashboardOrdersController,
  ],
  providers: [
    DashboardAnalyticsService,
    DashboardInventoryService,
    DashboardCustomersService,
    DashboardOrdersService,
  ],
  exports: [
    DashboardAnalyticsService,
    DashboardInventoryService,
    DashboardCustomersService,
    DashboardOrdersService,
  ],
})
export class DashboardModule {}