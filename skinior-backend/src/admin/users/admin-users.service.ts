import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserFilterDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers(filters: UserFilterDto) {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      status = 'all',
    } = filters;

    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (status !== 'all') {
      where.isActive = status === 'active';
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role && role !== 'all') {
      where.role = role;
    }

    // Execute query
    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          isSystem: true,
          createdAt: true,
          updatedAt: true,
          // Exclude password and sensitive fields
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaService.user.count({ where }),
    ]);

    return {
      users,
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

  async getUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        isSystem: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password and sensitive fields
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Get user activity and statistics
    const [orderCount, totalSpent] = await Promise.all([
      this.prismaService.order.count({
        where: { 
          customerEmail: user.email,
          status: { in: ['confirmed', 'shipped', 'delivered'] }
        },
      }),
      this.prismaService.order.aggregate({
        where: { 
          customerEmail: user.email,
          paymentStatus: 'paid'
        },
        _sum: { total: true },
      }),
    ]);

    const recentOrders = await this.prismaService.order.findMany({
      where: { customerEmail: user.email },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
      },
    });

    return {
      ...user,
      analytics: {
        totalOrders: orderCount,
        totalSpent: totalSpent._sum.total || 0,
        recentOrders,
      },
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    // Check if email already exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    try {
      // Hash password if provided
      let hashedPassword: string | undefined = undefined;
      if (createUserDto.password) {
        hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      }

      const user = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          isSystem: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('User with this email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      const updateData: any = { ...updateUserDto };

      // Hash password if provided
      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const user = await this.prismaService.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          isSystem: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('User with this email already exists');
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      // Soft delete - deactivate user
      await this.prismaService.user.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async getUsersAnalytics() {
    const [
      totalUsers,
      activeUsers,
      customerCount,
      adminCount,
      agentCount,
      recentUsersCount,
    ] = await Promise.all([
      this.prismaService.user.count(),
      this.prismaService.user.count({ where: { isActive: true } }),
      this.prismaService.user.count({ where: { role: 'customer' } }),
      this.prismaService.user.count({ where: { role: 'admin' } }),
      this.prismaService.user.count({ where: { role: 'agent' } }),
      this.prismaService.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    // Get recent users
    const recentUsers = await this.prismaService.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    // Get user registration trend (last 7 days)
    const registrationTrend = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        return this.prismaService.user.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
      })
    );

    return {
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        recentUsers: recentUsersCount,
      },
      roles: {
        customers: customerCount,
        admins: adminCount,
        agents: agentCount,
      },
      recentUsers,
      registrationTrend: registrationTrend.reverse(),
    };
  }
}