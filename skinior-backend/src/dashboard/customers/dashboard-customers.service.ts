import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerFilterDto } from '../dto/dashboard.dto';

@Injectable()
export class DashboardCustomersService {
  constructor(private prisma: PrismaService) {}

  async getCustomers(filters: CustomerFilterDto) {
    const { page = 1, limit = 10, search, role, isActive, registeredAfter, registeredBefore } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (registeredAfter || registeredBefore) {
      where.createdAt = {};
      if (registeredAfter) where.createdAt.gte = new Date(registeredAfter);
      if (registeredBefore) where.createdAt.lte = new Date(registeredBefore);
    }

    const [customers, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const [orderStats, lastOrder] = await Promise.all([
          this.prisma.order.aggregate({
            where: { userId: customer.id },
            _sum: { total: true },
            _count: { id: true },
          }),
          this.prisma.order.findFirst({
            where: { userId: customer.id },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true, total: true, status: true },
          }),
        ]);

        return {
          ...customer,
          totalSpent: orderStats._sum.total || 0,
          orderCount: orderStats._count.id || 0,
          lastOrder: lastOrder || null,
        };
      })
    );

    return {
      customers: customersWithStats,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCustomer(id: string) {
    const customer = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const [orderStats, recentOrders, analysisStats] = await Promise.all([
      this.prisma.order.aggregate({
        where: { userId: id },
        _sum: { total: true },
        _count: { id: true },
        _avg: { total: true },
      }),
      this.prisma.order.findMany({
        where: { userId: id },
        include: {
          items: {
            select: {
              id: true,
              productId: true,
              title: true,
              quantity: true,
              price: true,
              total: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.analysisSession.count({
        where: { userId: id },
      }),
    ]);

    const monthlySpending = await this.getCustomerMonthlySpending(id);

    return {
      ...customer,
      stats: {
        totalSpent: orderStats._sum.total || 0,
        totalOrders: orderStats._count.id || 0,
        averageOrderValue: orderStats._avg.total || 0,
        analysisSessionsCount: analysisStats,
      },
      recentOrders,
      monthlySpending,
    };
  }

  async updateCustomerStatus(id: string, isActive: boolean) {
    const customer = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  async getCustomerSegments() {
    const [
      totalCustomers,
      activeCustomers,
      newCustomers,
      returningCustomers,
      highValueCustomers,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'customer' } }),
      this.prisma.user.count({ where: { role: 'customer', isActive: true } }),
      this.prisma.user.count({
        where: {
          role: 'customer',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      this.getReturningCustomersCount(),
      this.getHighValueCustomersCount(),
    ]);

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers: totalCustomers - activeCustomers,
      newCustomers,
      returningCustomers,
      highValueCustomers,
    };
  }

  async getTopCustomers(limit = 10) {
    const topCustomers = await this.prisma.user.findMany({
      where: { role: 'customer' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
      take: limit,
    });

    const customersWithStats = await Promise.all(
      topCustomers.map(async (customer) => {
        const orderStats = await this.prisma.order.aggregate({
          where: { userId: customer.id },
          _sum: { total: true },
          _count: { id: true },
        });

        return {
          ...customer,
          totalSpent: orderStats._sum.total || 0,
          orderCount: orderStats._count.id || 0,
        };
      })
    );

    return customersWithStats
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }

  private async getCustomerMonthlySpending(customerId: string) {
    const monthlyData = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM(total) as total_spent,
        COUNT(*) as order_count
      FROM "Order"
      WHERE "userId" = ${customerId}
        AND "paymentStatus" = 'paid'
        AND "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

    return monthlyData;
  }

  private async getReturningCustomersCount() {
    // Get customers who have more than 1 order
    const customerOrderCounts = await this.prisma.order.groupBy({
      by: ['userId'],
      where: {
        userId: { not: null },
      },
      _count: { id: true },
      having: {
        id: { _count: { gt: 1 } },
      },
    });

    return customerOrderCounts.length;
  }

  private async getHighValueCustomersCount() {
    const highValueThreshold = 1000; // JOD 1000+

    const highValueCustomers = await this.prisma.order.groupBy({
      by: ['userId'],
      where: {
        userId: { not: null },
        total: { gte: highValueThreshold },
      },
    });

    return highValueCustomers.length;
  }
}