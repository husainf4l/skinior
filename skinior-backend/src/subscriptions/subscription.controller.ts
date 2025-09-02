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
    Headers,
    RawBody,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionService } from './subscription.service';
import {
    CreateSubscriptionPlanDto,
    StripeCreateSubscriptionDto,
    AppleReceiptDto,
    GooglePlayReceiptDto,
    GetSubscriptionsDto,
    CancelSubscriptionDto,
    UpdateUsageDto,
} from './dto/subscription.dto';
import {
    SubscriptionResponse,
    PaginatedPlans,
    PaginatedSubscriptions,
    StripeClientSecret,
    SubscriptionUsageResponse,
} from './dto/subscription.types';

interface AuthenticatedRequest {
    user?: {
        id: string;
        email: string;
        [key: string]: any;
    };
}

@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    // ==================== PUBLIC ENDPOINTS ====================

    @Get('plans')
    async getPlans(): Promise<PaginatedPlans> {
        return this.subscriptionService.getPlans();
    }

    @Get('plans/:id')
    async getPlan(@Param('id') planId: string): Promise<SubscriptionResponse> {
        return this.subscriptionService.getPlan(planId);
    }

    // ==================== ADMIN ENDPOINTS ====================

    @Post('admin/plans')
    // @UseGuards(AdminGuard) // Implement admin guard as needed
    async createPlan(
        @Body(ValidationPipe) dto: CreateSubscriptionPlanDto,
    ): Promise<SubscriptionResponse> {
        return this.subscriptionService.createPlan(dto);
    }

    // ==================== USER SUBSCRIPTION MANAGEMENT ====================

    @Post('stripe/create')
    @UseGuards(JwtAuthGuard)
    async createStripeSubscription(
        @Request() req: AuthenticatedRequest,
        @Body(ValidationPipe) dto: StripeCreateSubscriptionDto,
    ): Promise<StripeClientSecret> {
        return this.subscriptionService.createStripeSubscription(req.user!.id, dto);
    }

    @Post('apple/verify')
    @UseGuards(JwtAuthGuard)
    async verifyAppleReceipt(
        @Request() req: AuthenticatedRequest,
        @Body(ValidationPipe) dto: AppleReceiptDto,
    ): Promise<SubscriptionResponse> {
        return this.subscriptionService.verifyAppleReceipt(req.user!.id, dto);
    }

    @Post('google/verify')
    @UseGuards(JwtAuthGuard)
    async verifyGooglePlayPurchase(
        @Request() req: AuthenticatedRequest,
        @Body(ValidationPipe) dto: GooglePlayReceiptDto,
    ): Promise<SubscriptionResponse> {
        return this.subscriptionService.verifyGooglePlayPurchase(req.user!.id, dto);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    async getUserSubscriptions(
        @Request() req: AuthenticatedRequest,
        @Query(new ValidationPipe({ transform: true })) query: GetSubscriptionsDto,
    ): Promise<PaginatedSubscriptions> {
        return this.subscriptionService.getUserSubscriptions(req.user!.id, query);
    }

    @Get('active')
    @UseGuards(JwtAuthGuard)
    async getActiveSubscription(
        @Request() req: AuthenticatedRequest,
    ): Promise<SubscriptionResponse> {
        return this.subscriptionService.getActiveSubscription(req.user!.id);
    }

    @Put(':id/cancel')
    @UseGuards(JwtAuthGuard)
    async cancelSubscription(
        @Request() req: AuthenticatedRequest,
        @Param('id') subscriptionId: string,
        @Body(ValidationPipe) dto: CancelSubscriptionDto,
    ): Promise<SubscriptionResponse> {
        return this.subscriptionService.cancelSubscription(
            req.user!.id,
            subscriptionId,
            dto,
        );
    }

    // ==================== USAGE TRACKING ====================

    @Get('usage')
    @UseGuards(JwtAuthGuard)
    async getUserUsage(
        @Request() req: AuthenticatedRequest,
    ): Promise<SubscriptionUsageResponse> {
        return this.subscriptionService.getUserUsage(req.user!.id);
    }

    @Put('usage')
    @UseGuards(JwtAuthGuard)
    async updateUsage(
        @Request() req: AuthenticatedRequest,
        @Body(ValidationPipe) dto: UpdateUsageDto,
    ): Promise<SubscriptionResponse> {
        return this.subscriptionService.updateUsage(req.user!.id, dto);
    }

    // ==================== WEBHOOKS ====================

    @Post('webhooks/stripe')
    async handleStripeWebhook(
        @RawBody() rawBody: Buffer,
        @Headers('stripe-signature') signature: string,
    ): Promise<{ received: boolean }> {
        try {
            // Verify the webhook signature for security
            const event = await this.subscriptionService.verifyStripeWebhook(rawBody, signature);

            await this.subscriptionService.handleStripeWebhook(event);

            return { received: true };
        } catch (error) {
            console.error('Stripe webhook error:', error);
            throw error;
        }
    }

    @Post('webhooks/apple')
    async handleAppleWebhook(
        @Body() body: any,
    ): Promise<{ received: boolean }> {
        try {
            // Implement Apple App Store Server Notifications handling
            console.log('Apple webhook received:', body);

            return { received: true };
        } catch (error) {
            console.error('Apple webhook error:', error);
            throw error;
        }
    }

    @Post('webhooks/google')
    async handleGoogleWebhook(
        @Body() body: any,
    ): Promise<{ received: boolean }> {
        try {
            // Implement Google Play Developer Notifications handling
            console.log('Google webhook received:', body);

            return { received: true };
        } catch (error) {
            console.error('Google webhook error:', error);
            throw error;
        }
    }

    // ==================== HELPER ENDPOINTS ====================

    @Get('check-limits/:feature')
    @UseGuards(JwtAuthGuard)
    async checkFeatureLimit(
        @Request() req: AuthenticatedRequest,
        @Param('feature') feature: 'analyses' | 'storage' | 'chat',
    ): Promise<{
        success: boolean;
        allowed: boolean;
        remaining?: number;
        limit?: number;
        message: string;
    }> {
        try {
            const usage = await this.subscriptionService.getUserUsage(req.user!.id);
            const { limits, remainingUsage } = usage;

            let allowed = true;
            let remaining: number | undefined;
            let limit: number | undefined;
            let message = '';

            switch (feature) {
                case 'analyses':
                    limit = limits.maxAnalysesPerMonth;
                    remaining = remainingUsage.analysesRemaining;
                    allowed = limit === undefined || (remaining !== undefined && remaining > 0);
                    message = allowed
                        ? `${remaining || 'Unlimited'} analyses remaining`
                        : 'Analysis limit reached for this month';
                    break;

                case 'storage':
                    limit = limits.maxStorageGB;
                    remaining = remainingUsage.storageRemainingGB;
                    allowed = limit === undefined || (remaining !== undefined && remaining > 0);
                    message = allowed
                        ? `${remaining || 'Unlimited'} GB storage remaining`
                        : 'Storage limit reached';
                    break;

                case 'chat':
                    allowed = limits.aiChatEnabled;
                    message = allowed
                        ? 'AI Chat is available'
                        : 'AI Chat not available in your plan';
                    break;

                default:
                    message = 'Invalid feature';
                    allowed = false;
            }

            return {
                success: true,
                allowed,
                remaining,
                limit,
                message,
            };
        } catch (error) {
            return {
                success: false,
                allowed: false,
                message: 'Error checking feature limits',
            };
        }
    }
}
