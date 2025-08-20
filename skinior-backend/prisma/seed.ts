import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create brands
  const skiniorBrand = await prisma.brand.create({
    data: {
      name: 'Skinior',
      nameAr: 'سكينيور',
      slug: 'skinior',
      description: 'Premium skincare brand with AI-powered skin analysis',
      descriptionAr: 'علامة تجارية متميزة للعناية بالبشرة مع تحليل الذكاء الاصطناعي',
      website: 'https://skinior.com',
      isActive: true,
    },
  });

  const ceraveBrand = await prisma.brand.create({
    data: {
      name: 'CeraVe',
      nameAr: 'سيرافي',
      slug: 'cerave',
      description: 'Dermatologist-developed skincare',
      descriptionAr: 'منتجات العناية بالبشرة المطورة من قبل أطباء الجلدية',
      isActive: true,
    },
  });

  const ordinaryBrand = await prisma.brand.create({
    data: {
      name: 'The Ordinary',
      nameAr: 'ذا أورديناري',
      slug: 'the-ordinary',
      description: 'Clinical formulations with integrity',
      descriptionAr: 'تركيبات سريرية بنزاهة',
      isActive: true,
    },
  });

  // Create categories
  const skincare = await prisma.category.create({
    data: {
      name: 'Skincare',
      nameAr: 'العناية بالبشرة',
      slug: 'skincare',
      description: 'Professional skincare products',
    },
  });

  const serums = await prisma.category.create({
    data: {
      name: 'Serums',
      nameAr: 'المصل',
      slug: 'serums',
      description: 'Concentrated treatment serums',
      parentId: skincare.id,
    },
  });

  // Create featured products
  const vitaminCSerum = await prisma.product.create({
    data: {
      title: '25% Vitamin C Brightening Serum',
      titleAr: 'مصل فيتامين سي المضيء 25%',
      slug: 'vitamin-c-brightening-serum',
      descriptionEn: 'Powerful vitamin C serum for brightening and anti-aging',
      descriptionAr: 'مصل فيتامين سي قوي للإشراق ومكافحة الشيخوخة',
      price: 45.00,
      compareAtPrice: 60.00,
      currency: 'JOD',
      sku: 'VIT-C-25',
      isFeatured: true,
      isNew: true,
      activeIngredients: '25% Vitamin C, Hyaluronic Acid',
      skinType: 'All skin types',
      concerns: '["Dullness", "Fine lines", "Dark spots"]',
      usage: 'Morning',
      features: '["Advanced vitamin C formula", "24-hour hydration", "Suitable for sensitive skin", "Paraben and sulfate free"]',
      featuresAr: '["تركيبة متقدمة من فيتامين سي", "ترطيب يدوم لـ 24 ساعة", "مناسب للبشرة الحساسة", "خالي من البارابين والكبريتات"]',
      ingredients: 'High-quality Vitamin C, Concentrated Hyaluronic Acid, Niacinamide for skin tone evening',
      ingredientsAr: 'فيتامين سي عالي الجودة، حمض الهيالورونيك المركز، النياسيناميد لتوحيد لون البشرة',
      howToUse: 'Apply an appropriate amount to clean, dry skin and massage gently in circular motions until fully absorbed. Use twice daily, morning and evening for best results.',
      howToUseAr: 'ضع كمية مناسبة على بشرة نظيفة وجافة، ودلك بحركات دائرية لطيفة حتى يمتص بالكامل. يُستخدم مرتين يومياً صباحاً ومساءً للحصول على أفضل النتائج.',
      stockQuantity: 50,
      categoryId: serums.id,
    },
  });

  const hyaluronicMoisturizer = await prisma.product.create({
    data: {
      title: 'Hyaluronic Acid Moisturizer',
      titleAr: 'كريم مرطب حمض الهيالورونيك',
      slug: 'hyaluronic-acid-moisturizer',
      descriptionEn: 'Deep hydrating moisturizer with hyaluronic acid',
      descriptionAr: 'مرطب عميق بحمض الهيالورونيك',
      price: 38.00,
      currency: 'JOD',
      sku: 'HA-MOIST',
      isFeatured: true,
      activeIngredients: 'Hyaluronic Acid, Ceramides',
      skinType: 'Dry, Normal',
      concerns: '["Dryness", "Dehydration"]',
      usage: 'AM/PM',
      features: '["Advanced natural ingredients formula", "Deep 24-hour hydration", "Suitable for all sensitive skin types", "Paraben and harmful sulfate free"]',
      featuresAr: '["تركيبة متقدمة من المكونات الطبيعية", "ترطيب عميق يدوم لـ 24 ساعة", "مناسب لجميع أنواع البشرة الحساسة", "خالي من البارابين والكبريتات الضارة"]',
      ingredients: 'High-quality Hyaluronic Acid, Concentrated Vitamin C for brightness, Niacinamide for skin tone evening',
      ingredientsAr: 'حمض الهيالورونيك عالي الجودة، فيتامين سي المركز للإشراق، النياسيناميد لتوحيد لون البشرة',
      howToUse: 'Apply an appropriate amount of cream to clean, dry skin, and massage gently in circular motions until fully absorbed. Use twice daily, morning and evening for best results.',
      howToUseAr: 'ضع كمية مناسبة من الكريم على بشرة نظيفة وجافة، ودلك بحركات دائرية لطيفة حتى يمتص بالكامل. يُستخدم مرتين يومياً صباحاً ومساءً للحصول على أفضل النتائج.',
      stockQuantity: 35,
      categoryId: skincare.id,
    },
  });

  const retinolTreatment = await prisma.product.create({
    data: {
      title: 'Retinol Night Treatment',
      titleAr: 'علاج الريتينول الليلي',
      slug: 'retinol-night-treatment',
      descriptionEn: 'Advanced retinol treatment for anti-aging',
      descriptionAr: 'علاج ريتينول متقدم لمكافحة الشيخوخة',
      price: 52.00,
      currency: 'JOD',
      sku: 'RET-NIGHT',
      isFeatured: true,
      activeIngredients: '0.5% Retinol, Peptides',
      skinType: 'Normal, Mature',
      concerns: '["Fine lines", "Wrinkles", "Texture"]',
      usage: 'Night',
      features: '["Advanced retinol formula", "Anti-aging peptides", "Gentle on skin", "Clinically tested"]',
      featuresAr: '["تركيبة ريتينول متقدمة", "ببتيدات مكافحة الشيخوخة", "لطيف على البشرة", "مختبر سريرياً"]',
      ingredients: '0.5% Retinol, Anti-aging Peptides, Hyaluronic Acid for hydration',
      ingredientsAr: 'ريتينول 0.5%، ببتيدات مكافحة الشيخوخة، حمض الهيالورونيك للترطيب',
      howToUse: 'Apply to clean skin in the evening only. Start with 2-3 times per week and gradually increase usage. Always use sunscreen during the day.',
      howToUseAr: 'يُطبق على البشرة النظيفة في المساء فقط. ابدأ بـ 2-3 مرات في الأسبوع وزد الاستخدام تدريجياً. استخدم واقي الشمس دائماً في النهار.',
      stockQuantity: 25,
      categoryId: serums.id,
    },
  });

  const niacinamidePores = await prisma.product.create({
    data: {
      title: '20% Niacinamide Pore Refiner',
      titleAr: 'منقي المسام نياسيناميد 20%',
      slug: 'niacinamide-pore-refiner',
      descriptionEn: 'High-strength niacinamide for pore refinement',
      descriptionAr: 'نياسيناميد عالي القوة لتنقية المسام',
      price: 28.00,
      compareAtPrice: 35.00,
      currency: 'JOD',
      sku: 'NIAC-20',
      isFeatured: true,
      activeIngredients: '20% Niacinamide, Zinc PCA',
      skinType: 'Oily, Combination',
      concerns: '["Large pores", "Oiliness", "Texture"]',
      usage: 'AM/PM',
      features: '["High-strength niacinamide", "Pore minimizing", "Oil control", "Improves skin texture"]',
      featuresAr: '["نياسيناميد عالي القوة", "تصغير المسام", "تحكم في الزيوت", "تحسين ملمس البشرة"]',
      ingredients: '20% Niacinamide, Zinc PCA for oil control, Botanical extracts',
      ingredientsAr: 'نياسيناميد 20%، زنك PCA للتحكم في الزيوت، مستخلصات نباتية',
      howToUse: 'Apply 2-3 drops to clean skin morning and evening. Can be mixed with other serums or moisturizers.',
      howToUseAr: 'ضع 2-3 قطرات على البشرة النظيفة صباحاً ومساءً. يمكن خلطه مع سيرومات أو مرطبات أخرى.',
      stockQuantity: 40,
      categoryId: serums.id,
    },
  });

  // Add product images
  await prisma.productImage.createMany({
    data: [
      // Vitamin C Serum - 2 images
      {
        productId: vitaminCSerum.id,
        url: 'https://placehold.co/600x900',
        altText: 'Vitamin C Serum',
        isMain: true,
        sortOrder: 1,
      },
      {
        productId: vitaminCSerum.id,
        url: 'https://placehold.co/600x900/000000/FFF',
        altText: 'Vitamin C Serum Secondary',
        isHover: true,
        sortOrder: 2,
      },
      // Hyaluronic Moisturizer - 2 images
      {
        productId: hyaluronicMoisturizer.id,
        url: 'https://placehold.co/600x900',
        altText: 'Hyaluronic Moisturizer',
        isMain: true,
        sortOrder: 1,
      },
      {
        productId: hyaluronicMoisturizer.id,
        url: 'https://placehold.co/600x900/000000/FFF',
        altText: 'Hyaluronic Moisturizer Secondary',
        isHover: true,
        sortOrder: 2,
      },
      // Retinol Treatment - 2 images
      {
        productId: retinolTreatment.id,
        url: 'https://placehold.co/600x900',
        altText: 'Retinol Treatment',
        isMain: true,
        sortOrder: 1,
      },
      {
        productId: retinolTreatment.id,
        url: 'https://placehold.co/600x900/000000/FFF',
        altText: 'Retinol Treatment Secondary',
        isHover: true,
        sortOrder: 2,
      },
      // Niacinamide Pore Refiner - 2 images
      {
        productId: niacinamidePores.id,
        url: 'https://placehold.co/600x900',
        altText: 'Niacinamide Pore Refiner',
        isMain: true,
        sortOrder: 1,
      },
      {
        productId: niacinamidePores.id,
        url: 'https://placehold.co/600x900/000000/FFF',
        altText: 'Niacinamide Pore Refiner Secondary',
        isHover: true,
        sortOrder: 2,
      },
    ],
  });

  // Add some reviews
  await prisma.productReview.createMany({
    data: [
      {
        productId: vitaminCSerum.id,
        customerName: 'Sarah M.',
        rating: 5,
        title: 'Amazing results!',
        comment: 'My skin looks brighter after just 2 weeks of use.',
        isVerified: true,
      },
      {
        productId: hyaluronicMoisturizer.id,
        customerName: 'Ahmed K.',
        rating: 4,
        title: 'Very hydrating',
        comment: 'Great moisturizer for dry skin.',
        isVerified: true,
      },
      {
        productId: retinolTreatment.id,
        customerName: 'Layla H.',
        rating: 5,
        title: 'Effective anti-aging',
        comment: 'Noticed improvement in fine lines.',
        isVerified: true,
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
