const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

async function seedSubscriptionPlans() {
    try {
        // Delete existing plans
        await prisma.subscriptionPlan.deleteMany();

        // Create subscription plans
        const plans = [
            {
                name: 'Free',
                description: 'Basic skin analysis features',
                features: [
                    'Up to 3 skin analyses per month',
                    '500MB storage',
                    'Basic skin recommendations',
                    'Community support',
                ],
                monthlyPrice: 0,
                yearlyPrice: 0,
                maxAnalysesPerMonth: 3,
                maxStorageGB: 0.5,
                aiChatEnabled: false,
                prioritySupport: false,
                sortOrder: 1,
            },
            {
                name: 'Premium',
                description: 'Advanced skin analysis and AI chat',
                features: [
                    'Unlimited skin analyses',
                    '5GB storage',
                    'Advanced AI recommendations',
                    'AI chat assistant',
                    'Priority support',
                    'Export reports',
                ],
                monthlyPrice: 9.99,
                yearlyPrice: 99.99,
                maxAnalysesPerMonth: null, // unlimited
                maxStorageGB: 5,
                aiChatEnabled: true,
                prioritySupport: true,
                sortOrder: 2,
                // Add Stripe price IDs when you create them in Stripe Dashboard
                stripeMonthlyPriceId: 'price_premium_monthly',
                stripeYearlyPriceId: 'price_premium_yearly',
                // Add Apple App Store product IDs
                appleMonthlyProductId: 'com.skinior.premium.monthly',
                appleYearlyProductId: 'com.skinior.premium.yearly',
                // Add Google Play product IDs
                googleMonthlyProductId: 'premium_monthly',
                googleYearlyProductId: 'premium_yearly',
            },
            {
                name: 'Professional',
                description: 'Everything in Premium plus advanced features',
                features: [
                    'Everything in Premium',
                    'Unlimited storage',
                    'Advanced analytics',
                    'Professional reports',
                    'API access',
                    'White-label options',
                    'Dedicated support',
                ],
                monthlyPrice: 29.99,
                yearlyPrice: 299.99,
                maxAnalysesPerMonth: null, // unlimited
                maxStorageGB: null, // unlimited
                aiChatEnabled: true,
                prioritySupport: true,
                sortOrder: 3,
                // Add Stripe price IDs
                stripeMonthlyPriceId: 'price_professional_monthly',
                stripeYearlyPriceId: 'price_professional_yearly',
                // Add Apple App Store product IDs
                appleMonthlyProductId: 'com.skinior.professional.monthly',
                appleYearlyProductId: 'com.skinior.professional.yearly',
                // Add Google Play product IDs
                googleMonthlyProductId: 'professional_monthly',
                googleYearlyProductId: 'professional_yearly',
            },
        ];

        for (const plan of plans) {
            await prisma.subscriptionPlan.create({
                data: plan,
            });
            console.log(`Created plan: ${plan.name}`);
        }

        console.log('✅ Subscription plans seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding subscription plans:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seeder
seedSubscriptionPlans();
