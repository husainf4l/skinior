import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto, DeleteAccountDto } from './user.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as admin from 'firebase-admin';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  
  constructor(private prisma: PrismaService) { }

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

  async findUserByAppleId(appleId: string) {
    return this.prisma.user.findUnique({
      where: { appleId },
    });
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
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

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async createPasswordResetToken(email: string): Promise<string> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  async updateLastActive(): Promise<void> {
    // Method removed - lastActive field not in minimal schema
  }

  async verifyUser(): Promise<void> {
    // Method removed - isVerified field not in minimal schema
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private formatUserResponse(user: any): UserResponseDto {
    if (!user || typeof user !== 'object') {
      throw new Error('Invalid user object');
    }

    // Extract only the fields we want to return
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createGoogleUser(googleProfile: any): Promise<any> {
    const googleId = googleProfile?.id;
    const emails = googleProfile?.emails;
    const name = googleProfile?.name;
    const photos = googleProfile?.photos;

    if (!googleId || typeof googleId !== 'string') {
      throw new BadRequestException('Invalid Google profile: missing ID');
    }

    if (!emails || !Array.isArray(emails) || !emails[0] || !emails[0].value) {
      throw new BadRequestException('Invalid Google profile: missing email');
    }

    const email = emails[0].value;
    const firstName = name?.givenName || '';
    const lastName = name?.familyName || '';
    const avatar = photos?.[0]?.value || '';

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

  async createAppleUser(appleProfile: any): Promise<any> {
    // Handle both old structure (JWT payload) and new structure (mobile data)
    const appleId = appleProfile?.sub || appleProfile?.id;
    const email = appleProfile?.email;
    const firstName = appleProfile?.given_name || appleProfile?.firstName;
    const lastName = appleProfile?.family_name || appleProfile?.lastName;

    if (!appleId || typeof appleId !== 'string') {
      throw new BadRequestException(
        'Invalid Apple profile: missing Apple user ID',
      );
    }

    // Check if user already exists with this Apple ID
    const existingUserByAppleId = await this.findUserByAppleId(appleId);
    if (existingUserByAppleId) {
      return existingUserByAppleId;
    }

    // Check if user already exists with this email
    if (email) {
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        // Update with Apple ID if not already set
        if (!existingUser.appleId) {
          return this.prisma.user.update({
            where: { email },
            data: { appleId },
          });
        }
        return existingUser;
      }
    }

    // Create new user
    return this.prisma.user.create({
      data: {
        email: email || null,
        appleId,
        firstName: firstName || null,
        lastName: lastName || null,
      },
    });
  }

  async deleteAccount(
    userId: string, 
    deleteAccountDto: DeleteAccountDto
  ): Promise<{ success: boolean; message: string }> {
    const { confirmationText, reason, deleteData = true } = deleteAccountDto;

    // Validate confirmation text (should be "DELETE" or similar)
    const validConfirmations = ['DELETE', 'CONFIRM', 'delete', 'confirm'];
    if (!validConfirmations.includes(confirmationText)) {
      throw new BadRequestException(
        'Invalid confirmation text. Please type "DELETE" to confirm account deletion.'
      );
    }

    try {
      // Start transaction for atomic deletion
      await this.prisma.$transaction(async (prisma) => {
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            subscriptions: true,
            devices: true,
            notifications: true,
          },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        this.logger.log(`Starting account deletion for user ${userId}`, {
          reason,
          deleteData,
          userEmail: user.email,
          firebaseUid: user.firebaseUid,
        });

        // Delete Firebase user if firebaseUid exists
        if (user.firebaseUid) {
          try {
            await this.deleteFirebaseUser(user.firebaseUid);
            this.logger.log(`Firebase user deleted: ${user.firebaseUid}`);
          } catch (firebaseError) {
            // Log error but don't fail the entire deletion
            this.logger.error(`Failed to delete Firebase user ${user.firebaseUid}:`, firebaseError);
            // Continue with database deletion even if Firebase deletion fails
          }
        }

        if (deleteData) {
          // Complete data deletion (GDPR compliance)
          
          // 1. Cancel all active subscriptions
          await prisma.subscription.updateMany({
            where: { 
              userId,
              status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] }
            },
            data: { 
              status: 'CANCELED',
              canceledAt: new Date(),
              cancelAt: new Date()
            },
          });

          // 2. Delete user notifications
          await prisma.notification.deleteMany({
            where: { userId },
          });

          // 3. Delete user devices
          await prisma.device.deleteMany({
            where: { userId },
          });

          // 4. Delete subscription usage records
          await prisma.subscriptionUsage.deleteMany({
            where: { userId },
          });

          // 5. Delete payment records (keep for legal/audit purposes but anonymize)
          // Note: We'll keep payments for audit trail as they reference subscriptions
          
          // 6. Delete subscriptions
          await prisma.subscription.deleteMany({
            where: { userId },
          });

          // 7. Finally delete the user
          await prisma.user.delete({
            where: { id: userId },
          });

          this.logger.log(`Complete account deletion completed for user ${userId}`);

        } else {
          // Anonymize user data (soft deletion)
          const anonymizedEmail = `deleted_${crypto.randomUUID()}@deleted.local`;
          
          await prisma.user.update({
            where: { id: userId },
            data: {
              email: anonymizedEmail,
              firstName: null,
              lastName: null,
              avatar: null,
              password: null,
              googleId: null,
              appleId: null,
              firebaseUid: null, // Clear Firebase UID
              // Mark as deleted
              updatedAt: new Date(),
            },
          });

          // Cancel active subscriptions
          await prisma.subscription.updateMany({
            where: { 
              userId,
              status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] }
            },
            data: { 
              status: 'CANCELED',
              canceledAt: new Date(),
              cancelAt: new Date()
            },
          });

          this.logger.log(`Account anonymization completed for user ${userId}`);
        }
      });

      const action = deleteData ? 'deleted' : 'anonymized';
      return {
        success: true,
        message: `Your account has been successfully ${action}. We're sorry to see you go!`,
      };

    } catch (error) {
      this.logger.error(`Account deletion failed for user ${userId}:`, error);
      
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException('Failed to delete account. Please try again later.');
    }
  }

  private async deleteFirebaseUser(firebaseUid: string): Promise<void> {
    try {
      // Check if Firebase Admin is initialized
      if (!admin.apps.length) {
        this.logger.warn('Firebase Admin SDK not initialized. Skipping Firebase user deletion.');
        return;
      }

      // Delete the user from Firebase Auth
      await admin.auth().deleteUser(firebaseUid);
      this.logger.log(`Successfully deleted Firebase user: ${firebaseUid}`);
    } catch (error) {
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        this.logger.warn(`Firebase user not found: ${firebaseUid}. Likely already deleted.`);
        return; // Don't throw error if user doesn't exist
      }
      
      this.logger.error(`Failed to delete Firebase user ${firebaseUid}:`, error);
      throw error;
    }
  }
}
