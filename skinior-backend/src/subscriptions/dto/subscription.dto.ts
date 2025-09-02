import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, IsUUID, IsDecimal, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum BillingCycle {
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY',
}

export enum PaymentPlatform {
    STRIPE = 'STRIPE',
    APPLE_APP_STORE = 'APPLE_APP_STORE',
    GOOGLE_PLAY_STORE = 'GOOGLE_PLAY_STORE',
}

export enum SubscriptionStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    PAST_DUE = 'PAST_DUE',
    CANCELED = 'CANCELED',
    EXPIRED = 'EXPIRED',
    TRIALING = 'TRIALING',
    PAUSED = 'PAUSED',
}

// Create Subscription Plan DTO
export class CreateSubscriptionPlanDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsArray()
    features: string[];

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    monthlyPrice: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    yearlyPrice: number;

    @IsOptional()
    @IsString()
    stripeMonthlyPriceId?: string;

    @IsOptional()
    @IsString()
    stripeYearlyPriceId?: string;

    @IsOptional()
    @IsString()
    appleMonthlyProductId?: string;

    @IsOptional()
    @IsString()
    appleYearlyProductId?: string;

    @IsOptional()
    @IsString()
    googleMonthlyProductId?: string;

    @IsOptional()
    @IsString()
    googleYearlyProductId?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    maxAnalysesPerMonth?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    maxStorageGB?: number;

    @IsOptional()
    @IsBoolean()
    aiChatEnabled?: boolean;

    @IsOptional()
    @IsBoolean()
    prioritySupport?: boolean;

    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

// Create Subscription DTO
export class CreateSubscriptionDto {
    @IsString()
    planId: string;

    @IsEnum(BillingCycle)
    billingCycle: BillingCycle;

    @IsEnum(PaymentPlatform)
    platform: PaymentPlatform;

    @IsOptional()
    @IsString()
    platformSubscriptionId?: string;

    @IsOptional()
    @IsString()
    platformCustomerId?: string;

    @IsOptional()
    @IsString()
    promoCode?: string;
}

// Stripe Subscription DTO
export class StripeCreateSubscriptionDto {
    @IsString()
    planId: string;

    @IsEnum(BillingCycle)
    billingCycle: BillingCycle;

    @IsOptional()
    @IsString()
    paymentMethodId?: string;

    @IsOptional()
    @IsString()
    promoCode?: string;

    @IsOptional()
    @IsBoolean()
    trialDays?: boolean;
}

// Apple App Store Verification DTO
export class AppleReceiptDto {
    @IsString()
    planId: string;

    @IsString()
    receiptData: string; // Base64 encoded receipt

    @IsEnum(BillingCycle)
    billingCycle: BillingCycle;

    @IsOptional()
    @IsString()
    transactionId?: string;
}

// Google Play Verification DTO
export class GooglePlayReceiptDto {
    @IsString()
    planId: string;

    @IsString()
    purchaseToken: string;

    @IsString()
    productId: string;

    @IsEnum(BillingCycle)
    billingCycle: BillingCycle;

    @IsOptional()
    @IsString()
    orderId?: string;
}

// Update Subscription DTO
export class UpdateSubscriptionDto {
    @IsOptional()
    @IsString()
    planId?: string;

    @IsOptional()
    @IsEnum(BillingCycle)
    billingCycle?: BillingCycle;

    @IsOptional()
    @IsEnum(SubscriptionStatus)
    status?: SubscriptionStatus;
}

// Get Subscriptions Query DTO
export class GetSubscriptionsDto {
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
    @IsEnum(SubscriptionStatus)
    status?: SubscriptionStatus;

    @IsOptional()
    @IsEnum(PaymentPlatform)
    platform?: PaymentPlatform;
}

// Webhook DTOs
export class StripeWebhookDto {
    @IsString()
    eventType: string;

    @IsString()
    subscriptionId: string;

    @IsOptional()
    data?: any;
}

export class AppleWebhookDto {
    @IsString()
    notificationType: string;

    @IsString()
    receiptData: string;

    @IsOptional()
    data?: any;
}

export class GoogleWebhookDto {
    @IsString()
    notificationType: string;

    @IsString()
    purchaseToken: string;

    @IsString()
    subscriptionId: string;

    @IsOptional()
    data?: any;
}

// Cancel Subscription DTO
export class CancelSubscriptionDto {
    @IsOptional()
    @IsString()
    reason?: string;

    @IsOptional()
    @IsBoolean()
    immediately?: boolean = false;
}

// Usage Tracking DTO
export class UpdateUsageDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    analysesUsed?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    storageUsedGB?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    chatMessagesUsed?: number;
}
