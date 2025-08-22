import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsDto } from '../dto/dashboard.dto';

@Injectable()
export class DashboardAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverviewStats(dto: AnalyticsDto) {
    const { startDate, endDate } = dto;
    const dateFilter = this.getDateFilter(startDate, endDate);

    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockProducts,
    ] = await Promise.all([
      this.prisma.order.count({ where: dateFilter }),
      this.prisma.order.aggregate({
        where: { ...dateFilter, paymentStatus: 'paid' },
        _sum: { total: true },
      }),
      this.prisma.user.count({
        where: {
          role: 'customer',
          ...dateFilter,
        },
      }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.order.count({
        where: { status: 'pending', ...dateFilter },
      }),
      this.prisma.product.count({
        where: { stockQuantity: { lt: 10 }, isActive: true },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockProducts,
    };
  }

  async getRevenueChart(dto: AnalyticsDto) {
    const { startDate, endDate, period = 'day' } = dto;
    const dateFilter = this.getDateFilter(startDate, endDate);

    const groupBy = this.getGroupByPeriod(period);
    
    const revenueData = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC(${period}, "createdAt") as period,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM "Order"
      WHERE "paymentStatus" = 'paid'
        ${dateFilter.createdAt ? this.prisma.$queryRaw`AND "createdAt" >= ${dateFilter.createdAt.gte} AND "createdAt" <= ${dateFilter.createdAt.lte}` : this.prisma.$queryRaw``}
      GROUP BY DATE_TRUNC(${period}, "createdAt")
      ORDER BY period ASC
    `;

    return revenueData;
  }

  async getTopProducts(dto: AnalyticsDto) {
    const { startDate, endDate } = dto;
    const dateFilter = this.getDateFilter(startDate, endDate);

    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId', 'title'],
      where: {
        order: dateFilter,
      },
      _sum: {
        quantity: true,
        total: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 10,
    });

    return topProducts.map(item => ({
      productId: item.productId,
      title: item.title,
      totalSales: item._sum.total || 0,
      totalQuantity: item._sum.quantity || 0,
      orderCount: item._count.id,
    }));
  }

  async getCustomerStats(dto: AnalyticsDto) {
    const { startDate, endDate } = dto;
    const dateFilter = this.getDateFilter(startDate, endDate);

    const [
      newCustomers,
      returningCustomers,
      customerGrowth,
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          role: 'customer',
          ...dateFilter,
        },
      }),
      // Count users who have made orders (by checking orders table)
      this.prisma.order.groupBy({
        by: ['userId'],
        where: {
          userId: { not: null },
          ...dateFilter,
        },
      }).then(result => result.length),
      this.getCustomerGrowthChart(dto),
    ]);

    return {
      newCustomers,
      returningCustomers,
      customerGrowth,
    };
  }

  async getOrderStats(dto: AnalyticsDto) {
    const { startDate, endDate } = dto;
    const dateFilter = this.getDateFilter(startDate, endDate);

    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: {
        id: true,
      },
    });

    const ordersByPaymentMethod = await this.prisma.order.groupBy({
      by: ['paymentMethod'],
      where: dateFilter,
      _count: {
        id: true,
      },
    });

    return {
      ordersByStatus: ordersByStatus.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
      ordersByPaymentMethod: ordersByPaymentMethod.map(item => ({
        paymentMethod: item.paymentMethod,
        count: item._count.id,
      })),
    };
  }

  async getInventoryStats() {
    const [
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      categoryStats,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { stockQuantity: 0 } }),
      this.prisma.product.count({ where: { stockQuantity: { gt: 0, lt: 10 } } }),
      this.prisma.product.groupBy({
        by: ['categoryId'],
        where: { isActive: true },
        _count: { id: true },
        _sum: { stockQuantity: true },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      categoryStats: categoryStats.map(item => ({
        categoryId: item.categoryId,
        productCount: item._count.id,
        totalStock: item._sum.stockQuantity || 0,
      })),
    };
  }

  private async getCustomerGrowthChart(dto: AnalyticsDto) {
    const { startDate, endDate, period = 'day' } = dto;
    const dateFilter = this.getDateFilter(startDate, endDate);

    const growthData = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC(${period}, "createdAt") as period,
        COUNT(*) as new_customers
      FROM "User"
      WHERE "role" = 'customer'
        ${dateFilter.createdAt ? this.prisma.$queryRaw`AND "createdAt" >= ${dateFilter.createdAt.gte} AND "createdAt" <= ${dateFilter.createdAt.lte}` : this.prisma.$queryRaw``}
      GROUP BY DATE_TRUNC(${period}, "createdAt")
      ORDER BY period ASC
    `;

    return growthData;
  }

  private getDateFilter(startDate?: string, endDate?: string) {
    const filter: any = {};
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.gte = new Date(startDate);
      if (endDate) filter.createdAt.lte = new Date(endDate);
    }

    return filter;
  }

  private getGroupByPeriod(period: string) {
    switch (period) {
      case 'day':
        return 'day';
      case 'week':
        return 'week';
      case 'month':
        return 'month';
      case 'year':
        return 'year';
      default:
        return 'day';
    }
  }
}