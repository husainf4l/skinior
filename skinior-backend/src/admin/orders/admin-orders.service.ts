import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOrderDto, OrderFilterDto } from '../dto/order.dto';

@Injectable()
export class AdminOrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllOrders(filters: OrderFilterDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status = 'all',
      paymentStatus = 'all',
    } = filters;

    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (status !== 'all') {
      where.status = status;
    }
    
    if (paymentStatus !== 'all') {
      where.paymentStatus = paymentStatus;
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute query
    const [orders, total] = await Promise.all([
      this.prismaService.order.findMany({
        where,
        include: {
          items: {
            select: {
              id: true,
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
      this.prismaService.order.count({ where }),
    ]);

    // Add analytics to each order
    const ordersWithAnalytics = orders.map(order => ({
      ...order,
      analytics: {
        totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
        itemCount: order.items.length,
      },
    }));

    return {
      orders: ordersWithAnalytics,
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

  async getOrderById(id: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id },
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            title: true,
            sku: true,
            price: true,
            quantity: true,
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
      analytics: {
        totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
        itemCount: order.items.length,
      },
    };
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    try {
      const order = await this.prismaService.order.update({
        where: { id },
        data: updateOrderDto,
        include: {
          items: {
            select: {
              id: true,
              title: true,
              quantity: true,
              price: true,
              total: true,
            },
          },
        },
      });

      return {
        ...order,
        analytics: {
          totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
          itemCount: order.items.length,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update order');
    }
  }

  async getOrdersAnalytics() {
    // Get basic order counts
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      paidOrders,
      codOrders,
    ] = await Promise.all([
      this.prismaService.order.count(),
      this.prismaService.order.count({ where: { status: 'pending' } }),
      this.prismaService.order.count({ where: { status: 'confirmed' } }),
      this.prismaService.order.count({ where: { status: 'shipped' } }),
      this.prismaService.order.count({ where: { status: 'delivered' } }),
      this.prismaService.order.count({ where: { status: 'cancelled' } }),
      this.prismaService.order.count({ where: { paymentStatus: 'paid' } }),
      this.prismaService.order.count({ where: { paymentMethod: 'cod' } }),
    ]);

    // Get revenue data
    const [totalRevenue, monthlyRevenue] = await Promise.all([
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
    ]);

    // Get average order value
    const averageOrderValue = await this.prismaService.order.aggregate({
      where: { paymentStatus: 'paid' },
      _avg: { total: true },
    });

    // Get recent orders
    const recentOrders = await this.prismaService.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerEmail: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
      },
    });

    // Get daily sales for the last 7 days
    const salesTrend = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const [orderCount, revenue] = await Promise.all([
          this.prismaService.order.count({
            where: {
              createdAt: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          }),
          this.prismaService.order.aggregate({
            where: {
              paymentStatus: 'paid',
              createdAt: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
            _sum: { total: true },
          }),
        ]);

        return {
          date: startOfDay.toISOString().split('T')[0],
          orders: orderCount,
          revenue: revenue._sum.total || 0,
        };
      })
    );

    // Get top products by sales
    const topProducts = await this.prismaService.orderItem.groupBy({
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
      take: 10,
    });

    return {
      overview: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        monthlyRevenue: monthlyRevenue._sum.total || 0,
        averageOrderValue: averageOrderValue._avg.total || 0,
      },
      orderStatus: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      paymentMethods: {
        paid: paidOrders,
        cod: codOrders,
      },
      recentOrders,
      salesTrend: salesTrend.reverse(),
      topProducts: topProducts.map(product => ({
        productId: product.productId,
        title: product.title,
        totalQuantity: product._sum.quantity || 0,
        totalRevenue: product._sum.total || 0,
      })),
    };
  }
}