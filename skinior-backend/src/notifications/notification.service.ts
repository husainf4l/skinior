import {
    Injectable,
    BadRequestException,
    NotFoundException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as admin from 'firebase-admin';
import {
    RegisterDeviceDto,
    SendNotificationDto,
    GetNotificationsDto,
    MarkReadDto,
    NotificationSettingsDto,
    UnregisterDeviceDto,
    NotificationPriority,
} from './dto/notification.dto';
import {
    NotificationResponse,
    PaginatedNotifications,
} from './dto/notification.types';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(private prisma: PrismaService) {
        // Initialize Firebase Admin SDK if credentials are available
        try {
            if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
                if (!admin.apps.length) {
                    const serviceAccount = {
                        type: 'service_account',
                        project_id: process.env.FIREBASE_PROJECT_ID,
                        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                        client_email: process.env.FIREBASE_CLIENT_EMAIL,
                        client_id: process.env.FIREBASE_CLIENT_ID,
                        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                        token_uri: 'https://oauth2.googleapis.com/token',
                        auth_provider_x509_cert_url:
                            'https://www.googleapis.com/oauth2/v1/certs',
                        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
                    };

                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount as any),
                    });
                    this.logger.log('Firebase Admin SDK initialized successfully');
                }
            } else {
                this.logger.warn('Firebase credentials not found. Push notifications will not work.');
            }
        } catch (error) {
            this.logger.error('Failed to initialize Firebase Admin SDK:', error);
            this.logger.warn('Push notifications will not work. Please check Firebase configuration.');
        }
    }

    async registerDevice(
        userId: string,
        dto: RegisterDeviceDto,
    ): Promise<NotificationResponse> {
        try {
            const device = await this.prisma.device.upsert({
                where: {
                    userId_deviceToken: {
                        userId,
                        deviceToken: dto.deviceToken,
                    },
                },
                update: {
                    platform: dto.platform,
                    appVersion: dto.appVersion,
                    deviceModel: dto.deviceModel,
                    osVersion: dto.osVersion,
                    updatedAt: new Date(),
                },
                create: {
                    userId,
                    deviceToken: dto.deviceToken,
                    platform: dto.platform,
                    appVersion: dto.appVersion,
                    deviceModel: dto.deviceModel,
                    osVersion: dto.osVersion,
                },
            });

            return {
                success: true,
                message: 'Device registered successfully',
                deviceId: device.id,
            };
        } catch (error) {
            this.logger.error('Error registering device:', error);
            throw new BadRequestException('Failed to register device');
        }
    }

    async sendNotification(
        dto: SendNotificationDto,
    ): Promise<NotificationResponse> {
        try {
            let userId = dto.userId;
            let deviceTokens: string[] = [];

            if (dto.deviceId) {
                // Send to specific device
                const device = await this.prisma.device.findUnique({
                    where: { id: dto.deviceId },
                });
                if (!device) {
                    throw new NotFoundException('Device not found');
                }
                userId = device.userId;
                deviceTokens = [device.deviceToken];
            } else if (userId) {
                // Send to all user's devices
                const devices = await this.prisma.device.findMany({
                    where: { userId },
                    select: { deviceToken: true },
                });
                deviceTokens = devices.map((d) => d.deviceToken);
            } else {
                throw new BadRequestException(
                    'Either userId or deviceId must be provided',
                );
            }

            if (deviceTokens.length === 0) {
                throw new BadRequestException('No devices found for the user');
            }

            // Check notification settings
            const settings = await this.prisma.notificationSettings.findUnique({
                where: { userId },
            });

            if (settings && !settings.pushEnabled) {
                return {
                    success: true,
                    message: 'Notification not sent - push notifications disabled',
                };
            }

            // Create notification record
            const notification = await this.prisma.notification.create({
                data: {
                    userId,
                    title: dto.title,
                    body: dto.body,
                    data: dto.data,
                    sentAt: new Date(),
                },
            });

            // Send FCM message
            const baseMessage = {
                notification: {
                    title: dto.title,
                    body: dto.body,
                },
                android: {
                    priority:
                        dto.priority === NotificationPriority.HIGH ? 'high' : 'normal',
                    ttl: dto.ttl ? dto.ttl * 1000 : 86400000, // Convert to milliseconds, default 24h
                },
                apns: {
                    payload: {
                        aps: {
                            alert: {
                                title: dto.title,
                                body: dto.body,
                            },
                            sound: 'default',
                            badge: 1,
                        },
                    },
                },
            };

            // Send to each device individually
            const promises = deviceTokens.map((token) => {
                const message: any = {
                    ...baseMessage,
                    token,
                };

                if (dto.data) {
                    message.data = {
                        type: dto.data.type,
                        screen: dto.data.screen || '',
                        params: JSON.stringify(dto.data.params || {}),
                        action: dto.data.action || '',
                    };
                }

                return admin.messaging().send(message);
            });

            const responses = await Promise.allSettled(promises);
            const successCount = responses.filter(
                (r) => r.status === 'fulfilled',
            ).length;
            const failureCount = responses.filter(
                (r) => r.status === 'rejected',
            ).length;

            this.logger.log(
                `Notification sent to ${successCount} devices, ${failureCount} failed`,
            );

            return {
                success: true,
                message: 'Notification sent successfully',
                notificationId: notification.id,
            };
        } catch (error) {
            this.logger.error('Error sending notification:', error);
            throw new BadRequestException('Failed to send notification');
        }
    }

    async getNotifications(
        userId: string,
        dto: GetNotificationsDto,
    ): Promise<PaginatedNotifications> {
        try {
            const page = dto.page || 1;
            const limit = dto.limit || 20;
            const skip = (page - 1) * limit;

            const whereClause: any = { userId };

            if (dto.read === 'true') {
                whereClause.read = true;
            } else if (dto.read === 'false') {
                whereClause.read = false;
            }

            const [notifications, total] = await Promise.all([
                this.prisma.notification.findMany({
                    where: whereClause,
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit,
                }),
                this.prisma.notification.count({
                    where: whereClause,
                }),
            ]);

            const pages = Math.ceil(total / limit);

            return {
                success: true,
                notifications: notifications.map((n) => ({
                    id: n.id,
                    title: n.title,
                    body: n.body,
                    data: n.data,
                    read: n.read,
                    createdAt: n.createdAt,
                    sentAt: n.sentAt || undefined,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    pages,
                },
            };
        } catch (error) {
            this.logger.error('Error getting notifications:', error);
            throw new BadRequestException('Failed to get notifications');
        }
    }

    async markAsRead(
        userId: string,
        notificationId: string,
    ): Promise<NotificationResponse> {
        try {
            const notification = await this.prisma.notification.findFirst({
                where: {
                    id: notificationId,
                    userId,
                },
            });

            if (!notification) {
                throw new NotFoundException('Notification not found');
            }

            await this.prisma.notification.update({
                where: { id: notificationId },
                data: { read: true },
            });

            return {
                success: true,
                message: 'Notification marked as read',
            };
        } catch (error) {
            this.logger.error('Error marking notification as read:', error);
            throw new BadRequestException('Failed to mark notification as read');
        }
    }

    async markBulkAsRead(
        userId: string,
        dto: MarkReadDto,
    ): Promise<NotificationResponse> {
        try {
            const result = await this.prisma.notification.updateMany({
                where: {
                    id: { in: dto.notificationIds },
                    userId,
                },
                data: { read: true },
            });

            return {
                success: true,
                message: 'Notifications marked as read',
                updatedCount: result.count,
            };
        } catch (error) {
            this.logger.error('Error marking notifications as read:', error);
            throw new BadRequestException('Failed to mark notifications as read');
        }
    }

    async deleteNotification(
        userId: string,
        notificationId: string,
    ): Promise<NotificationResponse> {
        try {
            const notification = await this.prisma.notification.findFirst({
                where: {
                    id: notificationId,
                    userId,
                },
            });

            if (!notification) {
                throw new NotFoundException('Notification not found');
            }

            await this.prisma.notification.delete({
                where: { id: notificationId },
            });

            return {
                success: true,
                message: 'Notification deleted successfully',
            };
        } catch (error) {
            this.logger.error('Error deleting notification:', error);
            throw new BadRequestException('Failed to delete notification');
        }
    }

    async getNotificationSettings(userId: string): Promise<NotificationResponse> {
        try {
            let settings = await this.prisma.notificationSettings.findUnique({
                where: { userId },
            });

            if (!settings) {
                // Create default settings
                settings = await this.prisma.notificationSettings.create({
                    data: { userId },
                });
            }

            return {
                success: true,
                message: 'Notification settings retrieved successfully',
                settings: {
                    skinAnalysisComplete: settings.skinAnalysisComplete,
                    chatMessages: settings.chatMessages,
                    reminders: settings.reminders,
                    marketing: settings.marketing,
                    pushEnabled: settings.pushEnabled,
                    emailEnabled: settings.emailEnabled,
                },
            };
        } catch (error) {
            this.logger.error('Error getting notification settings:', error);
            throw new BadRequestException('Failed to get notification settings');
        }
    }

    async updateNotificationSettings(
        userId: string,
        dto: NotificationSettingsDto,
    ): Promise<NotificationResponse> {
        try {
            await this.prisma.notificationSettings.upsert({
                where: { userId },
                update: {
                    ...dto,
                    updatedAt: new Date(),
                },
                create: {
                    userId,
                    ...dto,
                },
            });

            return {
                success: true,
                message: 'Notification settings updated successfully',
            };
        } catch (error) {
            this.logger.error('Error updating notification settings:', error);
            throw new BadRequestException('Failed to update notification settings');
        }
    }

    async unregisterDevice(
        userId: string,
        dto: UnregisterDeviceDto,
    ): Promise<NotificationResponse> {
        try {
            const device = await this.prisma.device.findFirst({
                where: {
                    id: dto.deviceId,
                    userId,
                },
            });

            if (!device) {
                throw new NotFoundException('Device not found');
            }

            await this.prisma.device.delete({
                where: { id: dto.deviceId },
            });

            return {
                success: true,
                message: 'Device unregistered successfully',
            };
        } catch (error) {
            this.logger.error('Error unregistering device:', error);
            throw new BadRequestException('Failed to unregister device');
        }
    }
}
