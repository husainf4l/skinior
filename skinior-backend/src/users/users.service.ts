import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: string;
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || 'customer',
      },
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

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    const { password: _, ...result } = user;
    return result;
  }

  async updateUser(id: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
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

    return user;
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new ConflictException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
