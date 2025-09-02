export interface SubscriptionResponse {
    success: boolean;
    message: string;
    [key: string]: any;
}

export interface SubscriptionPlanData {
    id: string;
    name: string;
    description?: string;
    features: string[];
    monthlyPrice: number;
    yearlyPrice: number;
    maxAnalysesPerMonth?: number;
    maxStorageGB?: number;
    aiChatEnabled: boolean;
    prioritySupport: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface SubscriptionData {
    id: string;
    userId: string;
    planId: string;
    status: string;
    billingCycle: string;
    platform: string;
    amount: number;
    currency: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAt?: Date;
    canceledAt?: Date;
    trialStart?: Date;
    trialEnd?: Date;
    lastPaymentAt?: Date;
    nextPaymentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    plan?: SubscriptionPlanData;
}

export interface PaymentData {
    id: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    status: string;
    platform: string;
    platformPaymentId: string;
    paymentMethod?: string;
    paidAt?: Date;
    failedAt?: Date;
    refundedAt?: Date;
    createdAt: Date;
}

export interface UsageData {
    id: string;
    userId: string;
    periodStart: Date;
    periodEnd: Date;
    analysesUsed: number;
    storageUsedGB: number;
    chatMessagesUsed: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedSubscriptions {
    success: boolean;
    subscriptions: SubscriptionData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface PaginatedPlans {
    success: boolean;
    plans: SubscriptionPlanData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface StripeClientSecret {
    success: boolean;
    clientSecret: string;
    subscriptionId?: string;
}

export interface SubscriptionUsageResponse {
    success: boolean;
    usage: UsageData;
    limits: {
        maxAnalysesPerMonth?: number;
        maxStorageGB?: number;
        aiChatEnabled: boolean;
        prioritySupport: boolean;
    };
    remainingUsage: {
        analysesRemaining?: number;
        storageRemainingGB?: number;
    };
}
