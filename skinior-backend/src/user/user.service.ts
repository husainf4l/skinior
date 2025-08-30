import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        ...userData,
      },
    });

    return this.formatUserResponse(user);
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.formatUserResponse(user);
  }

  async findUserByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.formatUserResponse(updatedUser);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async updateLastActive(id: string): Promise<void> {
    // Method removed - lastActive field not in minimal schema
  }

  async verifyUser(id: string): Promise<void> {
    // Method removed - isVerified field not in minimal schema
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private formatUserResponse(user: any): UserResponseDto {
    const { password, refreshToken, googleId, ...userResponse } = user;
    return userResponse;
  }

  async createGoogleUser(googleProfile: any): Promise<any> {
    const { id: googleId, emails, name, photos } = googleProfile;
    const email = emails[0].value;
    const firstName = name.givenName;
    const lastName = name.familyName;
    const avatar = photos?.[0]?.value;

    // Check if user already exists with this email
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      // Update with Google ID if not already set
      if (!existingUser.googleId) {
        return this.prisma.user.update({
          where: { email },
          data: { googleId },
        });
      }
      return existingUser;
    }

    // Create new user
    return this.prisma.user.create({
      data: {
        email,
        googleId,
        firstName,
        lastName,
        avatar,
      },
    });
  }
}
