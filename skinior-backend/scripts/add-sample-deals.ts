import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addSampleDeals() {
  try {
    console.log('🛍️ Adding sample products with deals...');

    // Sample products with deals
    const productsWithDeals = [
      {
        title: 'Vitamin C Serum - Special Deal',
        titleAr: 'سيروم فيتامين سي - عرض خاص',
        slug: 'vitamin-c-serum-special-deal',
        descriptionEn: 'Brightening vitamin C serum with 20% L-Ascorbic Acid. Perfect for all skin types.',
        descriptionAr: 'سيروم فيتامين سي مُبيض مع 20% حمض الأسكوربيك. مثالي لجميع أنواع البشرة.',
        price: 45.00, // Current discounted price
        compareAtPrice: 75.00, // Original price (40% off)
        currency: 'JOD',
        sku: 'VIT-C-SERUM-001',
        barcode: '1234567890123',
        isActive: true,
        isFeatured: true,
        isNew: false,
        activeIngredients: '20% Vitamin C, Hyaluronic Acid',
        skinType: 'All skin types',
        concerns: JSON.stringify(['Dark spots', 'Dullness', 'Uneven skin tone']),
        usage: 'Morning',
        features: JSON.stringify([
          'Brightens skin tone',
          'Reduces dark spots',
          'Antioxidant protection',
          'Fast absorption'
        ]),
        ingredients: JSON.stringify([
          'L-Ascorbic Acid 20%',
          'Sodium Hyaluronate',
          'Vitamin E',
          'Ferulic Acid'
        ]),
        howToUse: 'Apply 2-3 drops to clean skin in the morning. Follow with moisturizer and SPF.',
        featuresAr: JSON.stringify([
          'يُفتح لون البشرة',
          'يقلل البقع الداكنة',
          'حماية مضادة للأكسدة',
          'امتصاص سريع'
        ]),
        ingredientsAr: JSON.stringify([
          'حمض الأسكوربيك 20%',
          'هيالورونات الصوديوم',
          'فيتامين إي',
          'حمض الفيروليك'
        ]),
        howToUseAr: 'ضع 2-3 قطرات على البشرة النظيفة في الصباح. اتبع بالمرطب وواقي الشمس.',
        stockQuantity: 50,
        viewCount: 120,
        salesCount: 25,
      },
      {
        title: 'Hyaluronic Acid Moisturizer - Flash Sale',
        titleAr: 'مرطب حمض الهيالورونيك - تخفيض مؤقت',
        slug: 'hyaluronic-acid-moisturizer-flash-sale',
        descriptionEn: 'Ultra-hydrating moisturizer with triple molecular weight hyaluronic acid.',
        descriptionAr: 'مرطب فائق الترطيب مع حمض الهيالورونيك ثلاثي الوزن الجزيئي.',
        price: 25.00, // Current discounted price
        compareAtPrice: 40.00, // Original price (37.5% off)
        currency: 'JOD',
        sku: 'HA-MOIST-002',
        barcode: '1234567890124',
        isActive: true,
        isFeatured: false,
        isNew: true,
        activeIngredients: 'Hyaluronic Acid 2%, Ceramides',
        skinType: 'All skin types',
        concerns: JSON.stringify(['Dryness', 'Dehydration', 'Fine lines']),
        usage: 'AM/PM',
        features: JSON.stringify([
          'Deep hydration',
          'Plumps skin',
          'Non-greasy formula',
          '24-hour moisture'
        ]),
        ingredients: JSON.stringify([
          'Sodium Hyaluronate',
          'Ceramide NP',
          'Squalane',
          'Niacinamide'
        ]),
        howToUse: 'Apply to clean skin morning and evening. Can be used under makeup.',
        featuresAr: JSON.stringify([
          'ترطيب عميق',
          'ينفخ البشرة',
          'تركيبة غير دهنية',
          'ترطيب 24 ساعة'
        ]),
        ingredientsAr: JSON.stringify([
          'هيالورونات الصوديوم',
          'سيراميد إن بي',
          'سكوالين',
          'نياسيناميد'
        ]),
        howToUseAr: 'ضع على البشرة النظيفة صباحاً ومساءً. يمكن استخدامه تحت المكياج.',
        stockQuantity: 30,
        viewCount: 85,
        salesCount: 15,
      },
      {
        title: 'Niacinamide Serum - Limited Time Offer',
        titleAr: 'سيروم النياسيناميد - عرض محدود',
        slug: 'niacinamide-serum-limited-offer',
        descriptionEn: 'Oil-controlling niacinamide serum that minimizes pores and reduces blemishes.',
        descriptionAr: 'سيروم النياسيناميد المُتحكم في الزيوت يُقلل المسام ويُقلل العيوب.',
        price: 30.00, // Current discounted price
        compareAtPrice: 50.00, // Original price (40% off)
        currency: 'JOD',
        sku: 'NIAC-SER-003',
        barcode: '1234567890125',
        isActive: true,
        isFeatured: true,
        isNew: false,
        activeIngredients: '10% Niacinamide, 1% Zinc PCA',
        skinType: 'Oily, Combination',
        concerns: JSON.stringify(['Large pores', 'Excess oil', 'Blemishes', 'Uneven texture']),
        usage: 'AM/PM',
        features: JSON.stringify([
          'Minimizes pores',
          'Controls oil production',
          'Reduces blemishes',
          'Improves skin texture'
        ]),
        ingredients: JSON.stringify([
          'Niacinamide 10%',
          'Zinc PCA 1%',
          'Hyaluronic Acid',
          'Tasmanian Pepperberry'
        ]),
        howToUse: 'Apply a few drops to clean skin twice daily. Avoid eye area.',
        featuresAr: JSON.stringify([
          'يُقلل المسام',
          'يُتحكم في إنتاج الزيوت',
          'يُقلل العيوب',
          'يُحسن ملمس البشرة'
        ]),
        ingredientsAr: JSON.stringify([
          'نياسيناميد 10%',
          'زنك PCA 1%',
          'حمض الهيالورونيك',
          'فلفل تاسمانيا'
        ]),
        howToUseAr: 'ضع بضع قطرات على البشرة النظيفة مرتين يومياً. تجنب منطقة العين.',
        stockQuantity: 40,
        viewCount: 200,
        salesCount: 35,
      },
      {
        title: 'Retinol Night Cream - Weekend Deal',
        titleAr: 'كريم الريتينول الليلي - عرض عطلة نهاية الأسبوع',
        slug: 'retinol-night-cream-weekend-deal',
        descriptionEn: 'Anti-aging night cream with encapsulated retinol for gentle yet effective results.',
        descriptionAr: 'كريم ليلي مضاد للشيخوخة مع ريتينول مُغلف للحصول على نتائج لطيفة وفعالة.',
        price: 55.00, // Current discounted price
        compareAtPrice: 85.00, // Original price (35% off)
        currency: 'JOD',
        sku: 'RET-CREAM-004',
        barcode: '1234567890126',
        isActive: true,
        isFeatured: false,
        isNew: true,
        activeIngredients: '0.5% Encapsulated Retinol, Peptides',
        skinType: 'Normal, Mature',
        concerns: JSON.stringify(['Fine lines', 'Wrinkles', 'Loss of firmness', 'Uneven texture']),
        usage: 'Night',
        features: JSON.stringify([
          'Reduces fine lines',
          'Improves skin texture',
          'Encapsulated for gentleness',
          'Rich moisturizing formula'
        ]),
        ingredients: JSON.stringify([
          'Retinol 0.5%',
          'Palmitoyl Pentapeptide-4',
          'Shea Butter',
          'Ceramides'
        ]),
        howToUse: 'Apply to clean skin at night. Start with 2-3 times per week. Always use SPF during the day.',
        featuresAr: JSON.stringify([
          'يُقلل الخطوط الدقيقة',
          'يُحسن ملمس البشرة',
          'مُغلف للطفاً',
          'تركيبة مرطبة غنية'
        ]),
        ingredientsAr: JSON.stringify([
          'ريتينول 0.5%',
          'بالميتويل بنتابيبتايد-4',
          'زبدة الشيا',
          'سيراميدز'
        ]),
        howToUseAr: 'ضع على البشرة النظيفة ليلاً. ابدأ بـ 2-3 مرات في الأسبوع. استخدم دائماً واقي الشمس خلال النهار.',
        stockQuantity: 20,
        viewCount: 95,
        salesCount: 12,
      }
    ];

    // Create products with deals
    for (const productData of productsWithDeals) {
      const product = await prisma.product.create({
        data: productData,
      });
      
      console.log(`✅ Created product: ${product.title} (${product.price} JOD, was ${product.compareAtPrice} JOD)`);
      
      // Calculate and display discount
      const discountAmount = (productData.compareAtPrice || 0) - productData.price;
      const discountPercentage = Math.round((discountAmount / (productData.compareAtPrice || 1)) * 100);
      console.log(`   💰 Discount: ${discountAmount.toFixed(2)} JOD (${discountPercentage}% off)`);
    }

    console.log('\n🎉 Sample deals added successfully!');
    console.log('📍 You can now test the deals endpoint: GET http://localhost:4008/api/products/deals/today');
    
    // Display summary
    const totalDeals = await prisma.product.count({
      where: {
        isActive: true,
        compareAtPrice: {
          not: null,
          gt: 0,
        },
      },
    });
    
    console.log(`📊 Total products with deals in database: ${totalDeals}`);

  } catch (error) {
    console.error('❌ Error adding sample deals:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addSampleDeals();
