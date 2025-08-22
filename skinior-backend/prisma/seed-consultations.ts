import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedConsultationsForUser() {
  const userId = '4b74c407-7b1f-47ee-9609-6b877fb6b36b';
  const userEmail = 'al-hussein@papayatrading.com';

  console.log(`🌱 Seeding consultations for user: ${userEmail}`);

  try {
    // Create multiple analysis sessions (consultations) for the user
    const consultations = [
      {
        id: 'consultation-1-' + Date.now(),
        userId,
        sessionId: 'session-acne-analysis-' + Date.now(),
        language: 'english',
        status: 'completed',
        metadata: {
          customerName: 'Al-hussein Abdullah',
          notes: 'Initial acne assessment - moderate level detected with oily skin type',
          consultationType: 'AI Skin Analysis',
        },
        createdAt: new Date('2025-01-15T10:30:00Z'),
        updatedAt: new Date('2025-01-15T11:00:00Z'),
        completedAt: new Date('2025-01-15T11:00:00Z'),
      },
      {
        id: 'consultation-2-' + Date.now(),
        userId,
        sessionId: 'session-aging-analysis-' + Date.now(),
        language: 'english',
        status: 'completed',
        metadata: {
          customerName: 'Al-hussein Abdullah',
          notes: 'Anti-aging consultation - fine lines and elasticity concerns',
          consultationType: 'AI Skin Analysis',
        },
        createdAt: new Date('2025-02-10T14:20:00Z'),
        updatedAt: new Date('2025-02-10T15:00:00Z'),
        completedAt: new Date('2025-02-10T15:00:00Z'),
      },
      {
        id: 'consultation-3-' + Date.now(),
        userId,
        sessionId: 'session-pigmentation-analysis-' + Date.now(),
        language: 'english',
        status: 'in_progress',
        metadata: {
          customerName: 'Al-hussein Abdullah',
          notes: 'Pigmentation and dark spots analysis - ongoing treatment',
          consultationType: 'AI Skin Analysis',
        },
        createdAt: new Date('2025-03-01T09:15:00Z'),
        updatedAt: new Date('2025-03-01T09:45:00Z'),
      },
    ];

    // Create analysis sessions
    for (const consultation of consultations) {
      const analysisSession = await prisma.analysisSession.create({
        data: consultation,
      });

      console.log(`✅ Created consultation: ${analysisSession.id}`);

      // Create analysis data for each consultation
      const analysisDataList = [
        {
          userId,
          analysisId: analysisSession.id,
          analysisType: 'skin_assessment',
          data: {
            skinType: consultation.id.includes('consultation-1') ? 'Oily' : consultation.id.includes('consultation-2') ? 'Combination' : 'Normal',
            skinScores: {
              hydration: consultation.id.includes('consultation-1') ? 45 : consultation.id.includes('consultation-2') ? 55 : 65,
              oiliness: consultation.id.includes('consultation-1') ? 85 : consultation.id.includes('consultation-2') ? 60 : 50,
              elasticity: consultation.id.includes('consultation-1') ? 70 : consultation.id.includes('consultation-2') ? 45 : 60,
              pigmentation: consultation.id.includes('consultation-1') ? 30 : consultation.id.includes('consultation-2') ? 40 : 75,
              texture: consultation.id.includes('consultation-1') ? 55 : consultation.id.includes('consultation-2') ? 50 : 45,
              pores: consultation.id.includes('consultation-1') ? 80 : consultation.id.includes('consultation-2') ? 65 : 55,
              acne: consultation.id.includes('consultation-1') ? 75 : 20,
              aging: consultation.id.includes('consultation-2') ? 60 : 25,
              sensitivity: 30,
            },
            concerns: consultation.id.includes('consultation-1') 
              ? ['Acne', 'Oily Skin', 'Large Pores']
              : consultation.id.includes('consultation-2')
              ? ['Fine Lines', 'Loss of Elasticity', 'Dullness']
              : ['Dark Spots', 'Uneven Skin Tone', 'Pigmentation'],
            recommendations: {
              morning: consultation.id.includes('consultation-1')
                ? ['Gentle Foaming Cleanser', 'Niacinamide Serum', 'SPF 50 Sunscreen']
                : consultation.id.includes('consultation-2')
                ? ['Hydrating Cleanser', 'Vitamin C Serum', 'Anti-aging Moisturizer', 'SPF 30']
                : ['Brightening Cleanser', 'Vitamin C Serum', 'Niacinamide', 'SPF 50'],
              evening: consultation.id.includes('consultation-1')
                ? ['Salicylic Acid Cleanser', 'BHA Toner', 'Oil-free Moisturizer']
                : consultation.id.includes('consultation-2')
                ? ['Gentle Cleanser', 'Retinol Serum', 'Peptide Moisturizer']
                : ['Gentle Cleanser', 'Alpha Arbutin Serum', 'Hydrating Moisturizer'],
            },
          },
          timestamp: consultation.createdAt,
        },
      ];

      for (const analysisData of analysisDataList) {
        await prisma.analysisData.create({
          data: analysisData,
        });
      }

      // Create product recommendations for each consultation
      const productRecommendations = consultation.id.includes('consultation-1')
        ? [
            {
              userId,
              analysisId: analysisSession.id,
              productId: 'prod-cerave-cleanser-001',
              productName: 'CeraVe Foaming Facial Cleanser',
              category: 'cleanser',
              priority: 'high',
              reason: 'Gentle yet effective cleansing for oily, acne-prone skin',
              brand: 'CeraVe',
              price: 15.99,
              skiniorUrl: 'https://example.com/cerave-cleanser',
            },
            {
              userId,
              analysisId: analysisSession.id,
              productId: 'prod-ordinary-niacinamide-001',
              productName: 'The Ordinary Niacinamide 10% + Zinc 1%',
              category: 'serum',
              priority: 'high',
              reason: 'Controls oil production and reduces appearance of blemishes',
              brand: 'The Ordinary',
              price: 7.99,
              skiniorUrl: 'https://example.com/ordinary-niacinamide',
            },
            {
              userId,
              analysisId: analysisSession.id,
              productId: 'prod-paulas-choice-bha-001',
              productName: 'Paula\'s Choice 2% BHA Liquid Exfoliant',
              category: 'treatment',
              priority: 'medium',
              reason: 'Unclogs pores and reduces blackheads',
              brand: 'Paula\'s Choice',
              price: 32.00,
              skiniorUrl: 'https://example.com/paulas-choice-bha',
            },
          ]
        : consultation.id.includes('consultation-2')
        ? [
            {
              userId,
              analysisId: analysisSession.id,
              productId: 'prod-neutrogena-hyaluronic-001',
              productName: 'Neutrogena Hydra Boost Hyaluronic Acid Serum',
              category: 'serum',
              priority: 'high',
              reason: 'Intensive hydration to plump fine lines',
              brand: 'Neutrogena',
              price: 18.99,
              skiniorUrl: 'https://example.com/neutrogena-hyaluronic',
            },
            {
              userId,
              analysisId: analysisSession.id,
              productId: 'prod-olay-regenerist-001',
              productName: 'Olay Regenerist Micro-Sculpting Cream',
              category: 'moisturizer',
              priority: 'high',
              reason: 'Anti-aging formula with amino-peptides',
              brand: 'Olay',
              price: 24.99,
              skiniorUrl: 'https://example.com/olay-regenerist',
            },
            {
              userId,
              analysisId: analysisSession.id,
              productId: 'prod-roc-retinol-001',
              productName: 'RoC Retinol Correxion Deep Wrinkle Serum',
              category: 'treatment',
              priority: 'medium',
              reason: 'Proven retinol for reducing fine lines and wrinkles',
              brand: 'RoC',
              price: 22.99,
              skiniorUrl: 'https://example.com/roc-retinol',
            },
          ]
        : [
            {
              userId,
              analysisId: analysisSession.id,
              productId: 'prod-vichy-bb-cream-001',
              productName: 'Vichy Capital Soleil BB Cream SPF 50',
              category: 'sunscreen',
              priority: 'high',
              reason: 'High protection with coverage for even skin tone',
              brand: 'Vichy',
              price: 28.99,
              skiniorUrl: 'https://example.com/vichy-bb-cream',
            },
            {
              userId,
              analysisId: analysisSession.id,
              productId: 'prod-loreal-vitamin-c-001',
              productName: 'L\'Oreal Paris Revitalift Derm Intensives Vitamin C Serum',
              category: 'serum',
              priority: 'high',
              reason: 'Brightens dark spots and evens skin tone',
              brand: 'L\'Oreal Paris',
              price: 19.99,
              skiniorUrl: 'https://example.com/loreal-vitamin-c',
            },
            {
              userId,
              analysisId: analysisSession.id,
              productId: 'prod-inkey-alpha-arbutin-001',
              productName: 'The INKEY List Alpha Arbutin',
              category: 'treatment',
              priority: 'medium',
              reason: 'Targets hyperpigmentation and dark spots',
              brand: 'The INKEY List',
              price: 9.99,
              skiniorUrl: 'https://example.com/inkey-alpha-arbutin',
            },
          ];

      for (const recommendation of productRecommendations) {
        await prisma.productRecommendation.create({
          data: recommendation,
        });
      }

      console.log(`✅ Created ${productRecommendations.length} product recommendations for consultation: ${analysisSession.id}`);
    }

    console.log(`🎉 Successfully seeded ${consultations.length} consultations for user: ${userEmail}`);
    
    // Summary
    const totalSessions = await prisma.analysisSession.count({
      where: { userId },
    });
    
    const totalRecommendations = await prisma.productRecommendation.count({
      where: { userId },
    });

    console.log(`📊 Summary:`);
    console.log(`   • Total consultations: ${totalSessions}`);
    console.log(`   • Total product recommendations: ${totalRecommendations}`);
    
  } catch (error) {
    console.error('❌ Error seeding consultations:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedConsultationsForUser();
  } catch (error) {
    console.error('Failed to seed consultations:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
