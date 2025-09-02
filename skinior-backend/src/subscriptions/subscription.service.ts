import { Injectable, BadRequestException, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import {
    CreateSubscriptionPlanDto,
    CreateSubscriptionDto,
    StripeCreateSubscriptionDto,
    AppleReceiptDto,
    GooglePlayReceiptDto,
    UpdateSubscriptionDto,
    GetSubscriptionsDto,
    CancelSubscriptionDto,
    UpdateUsageDto,
    BillingCycle,
    PaymentPlatform,
    SubscriptionStatus,
} from './dto/subscription.dto';
import {
    SubscriptionResponse,
    SubscriptionPlanData,
    SubscriptionData,
    PaginatedSubscriptions,
    PaginatedPlans,
    StripeClientSecret,
    SubscriptionUsageResponse,
} from './dto/subscription.types';

@Injectable()
export class SubscriptionService implements OnModuleInit {
    private readonly logger = new Logger(SubscriptionService.name);
    private stripe: Stripe;

    constructor(private prisma: PrismaService) { }

    onModuleInit() {
        // Initialize Stripe
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (stripeSecretKey) {
            this.stripe = new Stripe(stripeSecretKey, {
                apiVersion: '2025-08-27.basil',
            });
        } else {
            this.logger.warn('Stripe secret key not found. Stripe functionality will be disabled.');
        }
    }

    // ==================== SUBSCRIPTION PLANS ====================

    async createPlan(dto: CreateSubscriptionPlanDto): Promise<SubscriptionResponse> {
        try {
            const plan = await this.prisma.subscriptionPlan.create({
                data: {
                    ...dto,
                    features: dto.features,
                },
            });

            return {
                success: true,
                message: 'Subscription plan created successfully',
                plan,
            };
        } catch (error) {
            this.logger.error('Error creating subscription plan:', error);
            throw new BadRequestException('Failed to create subscription plan');
        }
    }

    async getPlans(): Promise<PaginatedPlans> {
        try {
            const plans = await this.prisma.subscriptionPlan.findMany({
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
            });

            return {
                success: true,
                plans: plans.map(plan => ({
                    ...plan,
                    description: plan.description || undefined,
                    monthlyPrice: Number(plan.monthlyPrice),
                    yearlyPrice: Number(plan.yearlyPrice),
                    features: plan.features as string[],
                    maxAnalysesPerMonth: plan.maxAnalysesPerMonth || undefined,
                    maxStorageGB: plan.maxStorageGB || undefined,
                })),
                pagination: {
                    page: 1,
                    limit: plans.length,
                    total: plans.length,
                    pages: 1,
                },
            };
        } catch (error) {
            this.logger.error('Error getting subscription plans:', error);
            throw new BadRequestException('Failed to get subscription plans');
        }
    }

    async getPlan(planId: string): Promise<SubscriptionResponse> {
        try {
            const plan = await this.prisma.subscriptionPlan.findUnique({
                where: { id: planId },
            });

            if (!plan) {
                throw new NotFoundException('Subscription plan not found');
            }

            return {
                success: true,
                message: 'Subscription plan retrieved successfully',
                plan: {
                    ...plan,
                    monthlyPrice: Number(plan.monthlyPrice),
                    yearlyPrice: Number(plan.yearlyPrice),
                },
            };
        } catch (error) {
            this.logger.error('Error getting subscription plan:', error);
            throw new BadRequestException('Failed to get subscription plan');
        }
    }

    // ==================== STRIPE SUBSCRIPTIONS ====================

    async createStripeSubscription(userId: string, dto: StripeCreateSubscriptionDto): Promise<StripeClientSecret> {
        try {
            if (!this.stripe) {
                throw new BadRequestException('Stripe is not configured');
            }

            const plan = await this.prisma.subscriptionPlan.findUnique({
                where: { id: dto.planId },
            });

            if (!plan) {
                throw new NotFoundException('Subscription plan not found');
            }

            const priceId = dto.billingCycle === BillingCycle.MONTHLY
                ? plan.stripeMonthlyPriceId
                : plan.stripeYearlyPriceId;

            if (!priceId) {
                throw new BadRequestException(`${dto.billingCycle} billing not available for this plan`);
            }

            // Get or create Stripe customer
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            let stripeCustomer = await this.stripe.customers.list({
                email: user.email,
                limit: 1,
            });

            let customerId: string;
            if (stripeCustomer.data.length > 0) {
                customerId = stripeCustomer.data[0].id;
            } else {
                const newCustomer = await this.stripe.customers.create({
                    email: user.email,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                    metadata: { userId },
                });
                customerId = newCustomer.id;
            }

            // Create Stripe subscription
            const subscription = await this.stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                payment_behavior: 'default_incomplete',
                payment_settings: { save_default_payment_method: 'on_subscription' },
                expand: ['latest_invoice.payment_intent'],
                trial_period_days: dto.trialDays ? 7 : undefined,
            });

            // Save subscription to database
            const amount = dto.billingCycle === BillingCycle.MONTHLY
                ? plan.monthlyPrice
                : plan.yearlyPrice;

            await this.prisma.subscription.create({
                data: {
                    userId,
                    planId: dto.planId,
                    status: SubscriptionStatus.PENDING,
                    billingCycle: dto.billingCycle,
                    platform: PaymentPlatform.STRIPE,
                    platformSubscriptionId: subscription.id,
                    platformCustomerId: customerId,
                    amount,
                    currency: 'USD',
                    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
                    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                    trialStart: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000) : null,
                    trialEnd: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000) : null,
                },
            });

            const invoice = (subscription as any).latest_invoice;
            const paymentIntent = invoice?.payment_intent;

            return {
                success: true,
                clientSecret: paymentIntent?.client_secret || '',
                subscriptionId: subscription.id,
            };
        } catch (error) {
            this.logger.error('Error creating Stripe subscription:', error);
            throw new BadRequestException('Failed to create subscription');
        }
    }

    // ==================== APPLE APP STORE ====================

    async verifyAppleReceipt(userId: string, dto: AppleReceiptDto): Promise<SubscriptionResponse> {
        try {
            const plan = await this.prisma.subscriptionPlan.findUnique({
                where: { id: dto.planId },
            });

            if (!plan) {
                throw new NotFoundException('Subscription plan not found');
            }

            // In a real implementation, you would verify the receipt with Apple's servers
            // For now, we'll create a mock verification
            const mockVerification = await this.mockAppleReceiptVerification(dto.receiptData);

            if (!mockVerification.success) {
                throw new BadRequestException('Invalid Apple receipt');
            }

            const amount = dto.billingCycle === BillingCycle.MONTHLY
                ? plan.monthlyPrice
                : plan.yearlyPrice;

            // Create subscription
            const subscription = await this.prisma.subscription.create({
                data: {
                    userId,
                    planId: dto.planId,
                    status: SubscriptionStatus.ACTIVE,
                    billingCycle: dto.billingCycle,
                    platform: PaymentPlatform.APPLE_APP_STORE,
                    platformSubscriptionId: dto.transactionId || mockVerification.transactionId,
                    amount,
                    currency: 'USD',
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date(Date.now() + (dto.billingCycle === BillingCycle.MONTHLY ? 30 : 365) * 24 * 60 * 60 * 1000),
                },
            });

            return {
                success: true,
                message: 'Apple subscription verified successfully',
                subscription,
            };
        } catch (error) {
            this.logger.error('Error verifying Apple receipt:', error);
            throw new BadRequestException('Failed to verify Apple receipt');
        }
    }

    private async mockAppleReceiptVerification(receiptData: string): Promise<any> {
        // Mock implementation - in production, use Apple's receipt validation API
        return {
            success: true,
            transactionId: `apple_${Date.now()}`,
            productId: 'com.skinior.premium.monthly',
        };
    }

    // ==================== GOOGLE PLAY STORE ====================

    async verifyGooglePlayPurchase(userId: string, dto: GooglePlayReceiptDto): Promise<SubscriptionResponse> {
        try {
            const plan = await this.prisma.subscriptionPlan.findUnique({
                where: { id: dto.planId },
            });

            if (!plan) {
                throw new NotFoundException('Subscription plan not found');
            }

            // In a real implementation, you would verify with Google Play Developer API
            const mockVerification = await this.mockGooglePlayVerification(dto.purchaseToken);

            if (!mockVerification.success) {
                throw new BadRequestException('Invalid Google Play purchase');
            }

            const amount = dto.billingCycle === BillingCycle.MONTHLY
                ? plan.monthlyPrice
                : plan.yearlyPrice;

            // Create subscription
            const subscription = await this.prisma.subscription.create({
                data: {
                    userId,
                    planId: dto.planId,
                    status: SubscriptionStatus.ACTIVE,
                    billingCycle: dto.billingCycle,
                    platform: PaymentPlatform.GOOGLE_PLAY_STORE,
                    platformSubscriptionId: dto.orderId || mockVerification.orderId,
                    amount,
                    currency: 'USD',
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date(Date.now() + (dto.billingCycle === BillingCycle.MONTHLY ? 30 : 365) * 24 * 60 * 60 * 1000),
                },
            });

            return {
                success: true,
                message: 'Google Play subscription verified successfully',
                subscription,
            };
        } catch (error) {
            this.logger.error('Error verifying Google Play purchase:', error);
            throw new BadRequestException('Failed to verify Google Play purchase');
        }
    }

    private async mockGooglePlayVerification(purchaseToken: string): Promise<any> {
        // Mock implementation - in production, use Google Play Developer API
        return {
            success: true,
            orderId: `google_${Date.now()}`,
            productId: 'premium_monthly',
        };
    }

    // ==================== SUBSCRIPTION MANAGEMENT ====================

    async getUserSubscriptions(userId: string, dto: GetSubscriptionsDto): Promise<PaginatedSubscriptions> {
        try {
            const page = dto.page || 1;
            const limit = dto.limit || 20;
            const skip = (page - 1) * limit;

            const whereClause: any = { userId };
            if (dto.status) whereClause.status = dto.status;
            if (dto.platform) whereClause.platform = dto.platform;

            const [subscriptions, total] = await Promise.all([
                this.prisma.subscription.findMany({
                    where: whereClause,
                    include: { plan: true },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit,
                }),
                this.prisma.subscription.count({ where: whereClause }),
            ]);

            return {
                success: true,
                subscriptions: subscriptions.map(sub => ({
                    ...sub,
                    amount: Number(sub.amount),
                    cancelAt: sub.cancelAt || undefined,
                    canceledAt: sub.canceledAt || undefined,
                    trialStart: sub.trialStart || undefined,
                    trialEnd: sub.trialEnd || undefined,
                    lastPaymentAt: sub.lastPaymentAt || undefined,
                    nextPaymentAt: sub.nextPaymentAt || undefined,
                    plan: sub.plan ? {
                        ...sub.plan,
                        description: sub.plan.description || undefined,
                        monthlyPrice: Number(sub.plan.monthlyPrice),
                        yearlyPrice: Number(sub.plan.yearlyPrice),
                        features: sub.plan.features as string[],
                        maxAnalysesPerMonth: sub.plan.maxAnalysesPerMonth || undefined,
                        maxStorageGB: sub.plan.maxStorageGB || undefined,
                    } : undefined,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            this.logger.error('Error getting user subscriptions:', error);
            throw new BadRequestException('Failed to get subscriptions');
        }
    }

    async getActiveSubscription(userId: string): Promise<SubscriptionResponse> {
        try {
            const subscription = await this.prisma.subscription.findFirst({
                where: {
                    userId,
                    status: SubscriptionStatus.ACTIVE,
                    currentPeriodEnd: { gt: new Date() },
                },
                include: { plan: true },
                orderBy: { createdAt: 'desc' },
            });

            if (!subscription) {
                return {
                    success: true,
                    message: 'No active subscription found',
                    subscription: null,
                };
            }

            return {
                success: true,
                message: 'Active subscription retrieved successfully',
                subscription: {
                    ...subscription,
                    amount: Number(subscription.amount),
                    cancelAt: subscription.cancelAt || undefined,
                    canceledAt: subscription.canceledAt || undefined,
                    trialStart: subscription.trialStart || undefined,
                    trialEnd: subscription.trialEnd || undefined,
                    lastPaymentAt: subscription.lastPaymentAt || undefined,
                    nextPaymentAt: subscription.nextPaymentAt || undefined,
                    plan: subscription.plan ? {
                        ...subscription.plan,
                        description: subscription.plan.description || undefined,
                        monthlyPrice: Number(subscription.plan.monthlyPrice),
                        yearlyPrice: Number(subscription.plan.yearlyPrice),
                        features: subscription.plan.features as string[],
                        maxAnalysesPerMonth: subscription.plan.maxAnalysesPerMonth || undefined,
                        maxStorageGB: subscription.plan.maxStorageGB || undefined,
                    } : undefined,
                },
            };
        } catch (error) {
            this.logger.error('Error getting active subscription:', error);
            throw new BadRequestException('Failed to get active subscription');
        }
    }

    async cancelSubscription(userId: string, subscriptionId: string, dto: CancelSubscriptionDto): Promise<SubscriptionResponse> {
        try {
            const subscription = await this.prisma.subscription.findFirst({
                where: { id: subscriptionId, userId },
            });

            if (!subscription) {
                throw new NotFoundException('Subscription not found');
            }

            const cancelAt = dto.immediately ? new Date() : subscription.currentPeriodEnd;

            await this.prisma.subscription.update({
                where: { id: subscriptionId },
                data: {
                    status: dto.immediately ? SubscriptionStatus.CANCELED : SubscriptionStatus.ACTIVE,
                    cancelAt,
                    canceledAt: dto.immediately ? new Date() : null,
                },
            });

            // Cancel on platform side
            if (subscription.platform === PaymentPlatform.STRIPE && this.stripe) {
                await this.stripe.subscriptions.update(subscription.platformSubscriptionId!, {
                    cancel_at: dto.immediately ? undefined : Math.floor(cancelAt.getTime() / 1000),
                    cancel_at_period_end: !dto.immediately,
                });
            }

            return {
                success: true,
                message: dto.immediately
                    ? 'Subscription canceled immediately'
                    : 'Subscription will be canceled at the end of the current period',
            };
        } catch (error) {
            this.logger.error('Error canceling subscription:', error);
            throw new BadRequestException('Failed to cancel subscription');
        }
    }

    // ==================== USAGE TRACKING ====================

    async getUserUsage(userId: string): Promise<SubscriptionUsageResponse> {
        try {
            const now = new Date();
            const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            let usage = await this.prisma.subscriptionUsage.findUnique({
                where: {
                    userId_periodStart_periodEnd: {
                        userId,
                        periodStart,
                        periodEnd,
                    },
                },
            });

            if (!usage) {
                usage = await this.prisma.subscriptionUsage.create({
                    data: {
                        userId,
                        periodStart,
                        periodEnd,
                        analysesUsed: 0,
                        storageUsedGB: 0,
                        chatMessagesUsed: 0,
                    },
                });
            }

            // Get user's active subscription to determine limits
            const activeSubscription = await this.getActiveSubscription(userId);
            const plan = activeSubscription.subscription?.plan;

            const limits = {
                maxAnalysesPerMonth: plan?.maxAnalysesPerMonth,
                maxStorageGB: plan?.maxStorageGB,
                aiChatEnabled: plan?.aiChatEnabled || false,
                prioritySupport: plan?.prioritySupport || false,
            };

            const remainingUsage = {
                analysesRemaining: limits.maxAnalysesPerMonth
                    ? Math.max(0, limits.maxAnalysesPerMonth - usage.analysesUsed)
                    : undefined,
                storageRemainingGB: limits.maxStorageGB
                    ? Math.max(0, limits.maxStorageGB - Number(usage.storageUsedGB))
                    : undefined,
            };

            return {
                success: true,
                usage: {
                    ...usage,
                    storageUsedGB: Number(usage.storageUsedGB),
                },
                limits,
                remainingUsage,
            };
        } catch (error) {
            this.logger.error('Error getting user usage:', error);
            throw new BadRequestException('Failed to get usage data');
        }
    }

    async updateUsage(userId: string, dto: UpdateUsageDto): Promise<SubscriptionResponse> {
        try {
            const now = new Date();
            const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const usage = await this.prisma.subscriptionUsage.upsert({
                where: {
                    userId_periodStart_periodEnd: {
                        userId,
                        periodStart,
                        periodEnd,
                    },
                },
                update: {
                    analysesUsed: dto.analysesUsed !== undefined
                        ? { increment: dto.analysesUsed }
                        : undefined,
                    storageUsedGB: dto.storageUsedGB !== undefined
                        ? { increment: dto.storageUsedGB }
                        : undefined,
                    chatMessagesUsed: dto.chatMessagesUsed !== undefined
                        ? { increment: dto.chatMessagesUsed }
                        : undefined,
                    updatedAt: new Date(),
                },
                create: {
                    userId,
                    periodStart,
                    periodEnd,
                    analysesUsed: dto.analysesUsed || 0,
                    storageUsedGB: dto.storageUsedGB || 0,
                    chatMessagesUsed: dto.chatMessagesUsed || 0,
                },
            });

            return {
                success: true,
                message: 'Usage updated successfully',
                usage,
            };
        } catch (error) {
            this.logger.error('Error updating usage:', error);
            throw new BadRequestException('Failed to update usage');
        }
    }

    // ==================== WEBHOOK HANDLERS ====================

    async verifyStripeWebhook(rawBody: Buffer, signature: string): Promise<Stripe.Event> {
        try {
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            if (!webhookSecret) {
                throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
            }

            if (!this.stripe) {
                throw new Error('Stripe is not initialized');
            }

            // Verify the webhook signature
            const event = this.stripe.webhooks.constructEvent(
                rawBody,
                signature,
                webhookSecret
            );

            this.logger.log(`Verified Stripe webhook: ${event.type}`);
            return event;
        } catch (error) {
            this.logger.error('Stripe webhook verification failed:', error);
            throw new BadRequestException('Invalid webhook signature');
        }
    }

    async handleStripeWebhook(event: Stripe.Event): Promise<void> {
        try {
            switch (event.type) {
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    await this.handleStripeSubscriptionEvent(event);
                    break;
                case 'invoice.payment_succeeded':
                case 'invoice.payment_failed':
                    await this.handleStripePaymentEvent(event);
                    break;
                default:
                    this.logger.log(`Unhandled Stripe event type: ${event.type}`);
            }
        } catch (error) {
            this.logger.error('Error handling Stripe webhook:', error);
            throw error;
        }
    }

    private async handleStripeSubscriptionEvent(event: Stripe.Event): Promise<void> {
        const subscription = event.data.object as any;

        await this.prisma.subscription.updateMany({
            where: { platformSubscriptionId: subscription.id },
            data: {
                status: this.mapStripeStatusToLocal(subscription.status),
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
                canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
            },
        });
    }

    private async handleStripePaymentEvent(event: Stripe.Event): Promise<void> {
        const invoice = event.data.object as any;

        if (invoice.subscription) {
            const subscription = await this.prisma.subscription.findFirst({
                where: { platformSubscriptionId: invoice.subscription as string },
            });

            if (subscription) {
                await this.prisma.payment.create({
                    data: {
                        subscriptionId: subscription.id,
                        amount: invoice.amount_paid / 100, // Convert from cents
                        currency: invoice.currency.toUpperCase(),
                        status: event.type === 'invoice.payment_succeeded' ? 'SUCCEEDED' : 'FAILED',
                        platform: PaymentPlatform.STRIPE,
                        platformPaymentId: invoice.payment_intent as string || `invoice_${invoice.id}`,
                        paymentMethod: 'card',
                        paidAt: event.type === 'invoice.payment_succeeded' ? new Date() : null,
                        failedAt: event.type === 'invoice.payment_failed' ? new Date() : null,
                    },
                });
            }
        }
    }

    private mapStripeStatusToLocal(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
        switch (stripeStatus) {
            case 'active':
                return SubscriptionStatus.ACTIVE;
            case 'canceled':
                return SubscriptionStatus.CANCELED;
            case 'incomplete':
            case 'incomplete_expired':
                return SubscriptionStatus.PENDING;
            case 'past_due':
                return SubscriptionStatus.PAST_DUE;
            case 'trialing':
                return SubscriptionStatus.TRIALING;
            case 'paused':
                return SubscriptionStatus.PAUSED;
            default:
                return SubscriptionStatus.PENDING;
        }
    }
}
