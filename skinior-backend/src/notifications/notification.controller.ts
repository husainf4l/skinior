import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import {
    RegisterDeviceDto,
    SendNotificationDto,
    GetNotificationsDto,
    MarkReadDto,
    NotificationSettingsDto,
    UnregisterDeviceDto,
} from './dto/notification.dto';
import {
    NotificationResponse,
    PaginatedNotifications,
} from './dto/notification.types';

interface AuthenticatedRequest {
    user?: {
        id: string;
        email: string;
        [key: string]: any;
    };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post('register-device')
    async registerDevice(
        @Request() req: AuthenticatedRequest,
        @Body(ValidationPipe) dto: RegisterDeviceDto,
    ): Promise<NotificationResponse> {
        return this.notificationService.registerDevice(req.user!.id, dto);
    }

    @Post('send')
    async sendNotification(
        @Body(ValidationPipe) dto: SendNotificationDto,
    ): Promise<NotificationResponse> {
        return this.notificationService.sendNotification(dto);
    }

    @Get()
    async getNotifications(
        @Request() req: AuthenticatedRequest,
        @Query(new ValidationPipe({ transform: true })) query: GetNotificationsDto,
    ): Promise<PaginatedNotifications> {
        return this.notificationService.getNotifications(req.user!.id, query);
    }

    @Put(':id/read')
    async markAsRead(
        @Request() req: AuthenticatedRequest,
        @Param('id') notificationId: string,
    ): Promise<NotificationResponse> {
        return this.notificationService.markAsRead(req.user!.id, notificationId);
    }

    @Put('mark-read')
    async markBulkAsRead(
        @Request() req: AuthenticatedRequest,
        @Body(ValidationPipe) dto: MarkReadDto,
    ): Promise<NotificationResponse> {
        return this.notificationService.markBulkAsRead(req.user!.id, dto);
    }

    @Delete(':id')
    async deleteNotification(
        @Request() req: AuthenticatedRequest,
        @Param('id') notificationId: string,
    ): Promise<NotificationResponse> {
        return this.notificationService.deleteNotification(
            req.user!.id,
            notificationId,
        );
    }

    @Get('settings')
    async getNotificationSettings(
        @Request() req: AuthenticatedRequest,
    ): Promise<NotificationResponse> {
        return this.notificationService.getNotificationSettings(req.user!.id);
    }

    @Put('settings')
    async updateNotificationSettings(
        @Request() req: AuthenticatedRequest,
        @Body(ValidationPipe) dto: NotificationSettingsDto,
    ): Promise<NotificationResponse> {
        return this.notificationService.updateNotificationSettings(
            req.user!.id,
            dto,
        );
    }

    @Delete('unregister-device')
    async unregisterDevice(
        @Request() req: AuthenticatedRequest,
        @Body(ValidationPipe) dto: UnregisterDeviceDto,
    ): Promise<NotificationResponse> {
        return this.notificationService.unregisterDevice(req.user!.id, dto);
    }
}
