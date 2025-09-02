import {
    IsString,
    IsOptional,
    IsEnum,
    IsObject,
    IsBoolean,
    IsNumber,
    IsArray,
    Min,
    Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum NotificationType {
    SKIN_ANALYSIS_COMPLETE = 'skin_analysis_complete',
    CHAT_MESSAGE = 'chat_message',
    REMINDER = 'reminder',
    MARKETING = 'marketing',
}

export enum NotificationPriority {
    NORMAL = 'normal',
    HIGH = 'high',
}

export enum Platform {
    IOS = 'ios',
    ANDROID = 'android',
}

export class RegisterDeviceDto {
    @IsString()
    deviceToken: string;

    @IsEnum(Platform)
    platform: Platform;

    @IsOptional()
    @IsString()
    appVersion?: string;

    @IsOptional()
    @IsString()
    deviceModel?: string;

    @IsOptional()
    @IsString()
    osVersion?: string;
}

export class SendNotificationDto {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    deviceId?: string;

    @IsString()
    title: string;

    @IsString()
    body: string;

    @IsOptional()
    @IsObject()
    data?: {
        type: NotificationType;
        screen?: string;
        params?: Record<string, any>;
        action?: string;
    };

    @IsOptional()
    @IsEnum(NotificationPriority)
    priority?: NotificationPriority;

    @IsOptional()
    @IsNumber()
    @Min(0)
    ttl?: number;
}

export class GetNotificationsDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @IsOptional()
    @IsString()
    read?: 'true' | 'false' | 'all';
}

export class MarkReadDto {
    @IsArray()
    @IsString({ each: true })
    notificationIds: string[];
}

export class NotificationSettingsDto {
    @IsBoolean()
    skinAnalysisComplete: boolean;

    @IsBoolean()
    chatMessages: boolean;

    @IsBoolean()
    reminders: boolean;

    @IsBoolean()
    marketing: boolean;

    @IsBoolean()
    pushEnabled: boolean;

    @IsBoolean()
    emailEnabled: boolean;
}

export class UnregisterDeviceDto {
    @IsString()
    deviceId: string;
}
