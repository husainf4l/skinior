import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderFilterDto, UpdateOrderStatusDto } from '../dto/dashboard.dto';

@Injectable()
export class DashboardOrdersService {
  constructor(private prisma: PrismaService) {}

  async getOrders(filters: OrderFilterDto) {
    const { page = 1, limit = 10, search, status, paymentMethod, paymentStatus, startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
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
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map(order => ({
        ...order,
        customer: {
          email: order.customerEmail,
          firstName: order.customerName?.split(' ')[0],
          lastName: order.customerName?.split(' ').slice(1).join(' '),
        },
        itemCount: order.items.length,
        mainImage: null, // Will need to fetch product images separately if needed
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            title: true,
            sku: true,
            quantity: true,
            price: true,
            total: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return {
      ...order,
      customer: {
        email: order.customerEmail,
        firstName: order.customerName?.split(' ')[0],
        lastName: order.customerName?.split(' ').slice(1).join(' '),
      },
    };
  }

  async updateOrderStatus(id: string, updateData: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: updateData.status,
        updatedAt: new Date(),
      },
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
    });

    // If order is delivered, we might want to send a notification here
    if (updateData.status === 'delivered') {
      // TODO: Send delivery notification
    }

    return updatedOrder;
  }

  async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      avgOrderValue,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'pending' } }),
      this.prisma.order.count({ where: { status: 'confirmed' } }),
      this.prisma.order.count({ where: { status: 'shipped' } }),
      this.prisma.order.count({ where: { status: 'delivered' } }),
      this.prisma.order.count({ where: { status: 'cancelled' } }),
      this.prisma.order.aggregate({
        where: { paymentStatus: 'paid' },
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where: { paymentStatus: 'paid' },
        _avg: { total: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      avgOrderValue: avgOrderValue._avg.total || 0,
    };
  }

  async getRecentOrders(limit = 10) {
    return this.prisma.order.findMany({
      include: {
        items: {
          take: 1,
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
      take: limit,
    });
  }

  async getOrdersByStatus() {
    const statusCounts = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    return statusCounts.map(item => ({
      status: item.status,
      count: item._count.id,
    }));
  }

  async getOrdersByPaymentMethod() {
    const paymentCounts = await this.prisma.order.groupBy({
      by: ['paymentMethod'],
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
    });

    return paymentCounts.map(item => ({
      paymentMethod: item.paymentMethod,
      count: item._count.id,
      totalRevenue: item._sum.total || 0,
    }));
  }

  async getDailySalesChart(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const salesData = await this.prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as order_count,
        SUM(total) as total_sales
      FROM "Order"
      WHERE "paymentStatus" = 'paid'
        AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    return salesData;
  }

  async getPendingActions() {
    const [
      pendingPayments,
      pendingShipments,
      codOrders,
      lowStockItems,
    ] = await Promise.all([
      this.prisma.order.count({
        where: { 
          status: 'pending',
          paymentStatus: 'pending',
        },
      }),
      this.prisma.order.count({
        where: { 
          status: 'confirmed',
        },
      }),
      this.prisma.order.count({
        where: { 
          paymentMethod: 'cod',
          paymentStatus: 'cod_pending',
        },
      }),
      this.prisma.product.count({
        where: { 
          stockQuantity: { lt: 10 },
          isActive: true,
        },
      }),
    ]);

    return {
      pendingPayments,
      pendingShipments,
      codOrders,
      lowStockItems,
    };
  }
}