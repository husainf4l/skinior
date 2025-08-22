import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminAnalyticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboardOverview() {
    const [
      // Products
      totalProducts,
      activeProducts,
      lowStockProducts,
      
      // Orders
      totalOrders,
      pendingOrders,
      todayOrders,
      
      // Revenue
      totalRevenue,
      monthlyRevenue,
      todayRevenue,
      
      // Users
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      
      // Categories & Brands
      totalCategories,
      totalBrands,
    ] = await Promise.all([
      // Products
      this.prismaService.product.count(),
      this.prismaService.product.count({ where: { isActive: true } }),
      this.prismaService.product.count({ 
        where: { stockQuantity: { lte: 10, gt: 0 }, isActive: true } 
      }),
      
      // Orders
      this.prismaService.order.count(),
      this.prismaService.order.count({ where: { status: 'pending' } }),
      this.prismaService.order.count({ 
        where: { 
          createdAt: { 
            gte: new Date(new Date().setHours(0, 0, 0, 0)) 
          } 
        } 
      }),
      
      // Revenue
      this.prismaService.order.aggregate({
        where: { paymentStatus: 'paid' },
        _sum: { total: true },
      }),
      this.prismaService.order.aggregate({
        where: {
          paymentStatus: 'paid',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { total: true },
      }),
      this.prismaService.order.aggregate({
        where: {
          paymentStatus: 'paid',
          createdAt: { 
            gte: new Date(new Date().setHours(0, 0, 0, 0)) 
          },
        },
        _sum: { total: true },
      }),
      
      // Users
      this.prismaService.user.count(),
      this.prismaService.user.count({ where: { isActive: true } }),
      this.prismaService.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      
      // Categories & Brands
      this.prismaService.category.count(),
      this.prismaService.brand.count(),
    ]);

    // Get recent activity
    const recentOrders = await this.prismaService.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    const recentProducts = await this.prismaService.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        price: true,
        stockQuantity: true,
        isActive: true,
        createdAt: true,
      },
    });

    return {
      summary: {
        products: {
          total: totalProducts,
          active: activeProducts,
          lowStock: lowStockProducts,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          today: todayOrders,
        },
        revenue: {
          total: totalRevenue._sum.total || 0,
          monthly: monthlyRevenue._sum.total || 0,
          today: todayRevenue._sum.total || 0,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: newUsersThisMonth,
        },
        catalog: {
          categories: totalCategories,
          brands: totalBrands,
        },
      },
      recentActivity: {
        orders: recentOrders,
        products: recentProducts,
      },
    };
  }

  async getRevenueAnalytics(period: string = '30d') {
    const days = this.getPeriodDays(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get revenue data for the period
    const revenueData = await this.prismaService.order.findMany({
      where: {
        paymentStatus: 'paid',
        createdAt: { gte: startDate },
      },
      select: {
        total: true,
        createdAt: true,
        paymentMethod: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const dailyRevenue = this.groupRevenueByDay(revenueData, days);

    // Calculate growth
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days);

    const [currentPeriodRevenue, previousPeriodRevenue] = await Promise.all([
      this.prismaService.order.aggregate({
        where: {
          paymentStatus: 'paid',
          createdAt: { gte: startDate },
        },
        _sum: { total: true },
      }),
      this.prismaService.order.aggregate({
        where: {
          paymentStatus: 'paid',
          createdAt: { gte: previousPeriodStart, lt: startDate },
        },
        _sum: { total: true },
      }),
    ]);

    const currentTotal = currentPeriodRevenue._sum.total || 0;
    const previousTotal = previousPeriodRevenue._sum.total || 0;
    const growth = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

    return {
      period,
      totalRevenue: currentTotal,
      previousPeriodRevenue: previousTotal,
      growth: Math.round(growth * 100) / 100,
      dailyRevenue,
      paymentMethods: this.getPaymentMethodBreakdown(revenueData),
    };
  }

  async getProductPerformance(limit: number = 20) {
    // Top selling products
    const topSellingProducts = await this.prismaService.orderItem.groupBy({
      by: ['productId', 'title'],
      _sum: {
        quantity: true,
        total: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    // Top revenue generating products
    const topRevenueProducts = await this.prismaService.orderItem.groupBy({
      by: ['productId', 'title'],
      _sum: {
        quantity: true,
        total: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: limit,
    });

    // Low performing products
    const lowPerformingProducts = await this.prismaService.product.findMany({
      where: {
        isActive: true,
        salesCount: { lte: 5 },
      },
      orderBy: { salesCount: 'asc' },
      take: limit,
      select: {
        id: true,
        title: true,
        price: true,
        stockQuantity: true,
        salesCount: true,
        viewCount: true,
        createdAt: true,
      },
    });

    // Product categories performance
    const categoryPerformance = await this.prismaService.category.findMany({
      include: {
        _count: {
          select: {
            products: { where: { isActive: true } },
          },
        },
        products: {
          where: { isActive: true },
          select: {
            salesCount: true,
            viewCount: true,
            price: true,
          },
        },
      },
    });

    const categoryStats = categoryPerformance.map(category => {
      const totalSales = category.products.reduce((sum, product) => sum + product.salesCount, 0);
      const totalViews = category.products.reduce((sum, product) => sum + product.viewCount, 0);
      const avgPrice = category.products.length > 0 
        ? category.products.reduce((sum, product) => sum + product.price, 0) / category.products.length
        : 0;

      return {
        id: category.id,
        name: category.name,
        nameAr: category.nameAr,
        productCount: category._count.products,
        totalSales,
        totalViews,
        averagePrice: Math.round(avgPrice * 100) / 100,
      };
    });

    return {
      topSelling: topSellingProducts.map(product => ({
        productId: product.productId,
        title: product.title,
        quantitySold: product._sum.quantity || 0,
        totalRevenue: product._sum.total || 0,
      })),
      topRevenue: topRevenueProducts.map(product => ({
        productId: product.productId,
        title: product.title,
        quantitySold: product._sum.quantity || 0,
        totalRevenue: product._sum.total || 0,
      })),
      lowPerforming: lowPerformingProducts,
      categoryPerformance: categoryStats.sort((a, b) => b.totalSales - a.totalSales),
    };
  }

  async getCustomerAnalytics() {
    const [
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      repeatCustomers,
    ] = await Promise.all([
      this.prismaService.user.count({ where: { role: 'customer' } }),
      this.prismaService.user.count({ 
        where: { role: 'customer', isActive: true } 
      }),
      this.prismaService.user.count({
        where: {
          role: 'customer',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      // Count customers with more than one order
      this.prismaService.$queryRaw`
        SELECT COUNT(DISTINCT "customerEmail")::int as count
        FROM "Order" 
        WHERE "customerEmail" IN (
          SELECT "customerEmail" 
          FROM "Order" 
          GROUP BY "customerEmail" 
          HAVING COUNT(*) > 1
        )
      `,
    ]);

    // Top customers by spending
    const topCustomers = await this.prismaService.order.groupBy({
      by: ['customerEmail', 'customerName'],
      where: { paymentStatus: 'paid' },
      _sum: { total: true },
      _count: { id: true },
      orderBy: {
        _sum: { total: 'desc' },
      },
      take: 10,
    });

    // Customer acquisition over time (last 12 months)
    const customerAcquisition = await Promise.all(
      Array.from({ length: 12 }, async (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const count = await this.prismaService.user.count({
          where: {
            role: 'customer',
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        return {
          month: startOfMonth.toISOString().substring(0, 7), // YYYY-MM format
          customers: count,
        };
      })
    );

    return {
      overview: {
        total: totalCustomers,
        active: activeCustomers,
        newThisMonth: newCustomersThisMonth,
        repeat: Array.isArray(repeatCustomers) && repeatCustomers.length > 0 ? (repeatCustomers[0] as any)?.count || 0 : 0,
      },
      topCustomers: topCustomers.map(customer => ({
        email: customer.customerEmail,
        name: customer.customerName,
        totalSpent: customer._sum.total || 0,
        orderCount: customer._count.id,
      })),
      acquisition: customerAcquisition.reverse(),
    };
  }

  async getInventoryAnalytics() {
    const [
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      lowStockProducts,
      overStockProducts,
    ] = await Promise.all([
      this.prismaService.product.count({ where: { isActive: true } }),
      this.prismaService.product.count({ 
        where: { isActive: true, stockQuantity: { gt: 0 } } 
      }),
      this.prismaService.product.count({ 
        where: { isActive: true, stockQuantity: { lte: 0 } } 
      }),
      this.prismaService.product.count({ 
        where: { isActive: true, stockQuantity: { lte: 10, gt: 0 } } 
      }),
      this.prismaService.product.count({ 
        where: { isActive: true, stockQuantity: { gte: 100 } } 
      }),
    ]);

    // Get products by stock status
    const [lowStockProductsList, outOfStockProductsList] = await Promise.all([
      this.prismaService.product.findMany({
        where: { 
          isActive: true, 
          stockQuantity: { lte: 10, gt: 0 } 
        },
        select: {
          id: true,
          title: true,
          stockQuantity: true,
          salesCount: true,
          price: true,
        },
        orderBy: { stockQuantity: 'asc' },
        take: 20,
      }),
      this.prismaService.product.findMany({
        where: { 
          isActive: true, 
          stockQuantity: { lte: 0 } 
        },
        select: {
          id: true,
          title: true,
          stockQuantity: true,
          salesCount: true,
          price: true,
        },
        orderBy: { salesCount: 'desc' },
        take: 20,
      }),
    ]);

    // Calculate inventory value
    const inventoryValue = await this.prismaService.product.aggregate({
      where: { isActive: true },
      _sum: {
        stockQuantity: true,
      },
    });

    const totalInventoryValue = await this.prismaService.$queryRaw<[{ total: number }]>`
      SELECT SUM("price" * "stockQuantity")::float as total
      FROM "Product" 
      WHERE "isActive" = true
    `;

    return {
      overview: {
        total: totalProducts,
        inStock: inStockProducts,
        outOfStock: outOfStockProducts,
        lowStock: lowStockProducts,
        overStock: overStockProducts,
        totalUnits: inventoryValue._sum.stockQuantity || 0,
        totalValue: totalInventoryValue[0]?.total || 0,
      },
      alerts: {
        lowStock: lowStockProductsList,
        outOfStock: outOfStockProductsList,
      },
      stockDistribution: {
        inStock: inStockProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts,
        overStock: overStockProducts,
      },
    };
  }

  // Helper methods
  private getPeriodDays(period: string): number {
    switch (period) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  }

  private groupRevenueByDay(revenueData: any[], days: number) {
    const dailyRevenue = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split('T')[0],
        revenue: 0,
        orders: 0,
      };
    });

    revenueData.forEach(order => {
      const orderDate = order.createdAt.toISOString().split('T')[0];
      const dayData = dailyRevenue.find(day => day.date === orderDate);
      if (dayData) {
        dayData.revenue += order.total;
        dayData.orders += 1;
      }
    });

    return dailyRevenue;
  }

  private getPaymentMethodBreakdown(revenueData: any[]) {
    const breakdown = revenueData.reduce((acc, order) => {
      const method = order.paymentMethod;
      if (!acc[method]) {
        acc[method] = { total: 0, count: 0 };
      }
      acc[method].total += order.total;
      acc[method].count += 1;
      return acc;
    }, {});

    return Object.entries(breakdown).map(([method, data]: [string, any]) => ({
      method,
      total: data.total,
      count: data.count,
      percentage: (data.total / revenueData.reduce((sum, order) => sum + order.total, 0)) * 100,
    }));
  }
}