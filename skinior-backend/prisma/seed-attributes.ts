import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding product attributes...');

  // Create Color attribute
  const colorAttribute = await prisma.productAttribute.upsert({
    where: { slug: 'color' },
    update: {
      name: 'Color',
      nameAr: 'اللون',
      description: 'Product color variants',
    },
    create: {
      name: 'Color',
      nameAr: 'اللون',
      slug: 'color',
      description: 'Product color variants',
      sortOrder: 1,
    },
  });

  // Create Size attribute
  const sizeAttribute = await prisma.productAttribute.upsert({
    where: { slug: 'size' },
    update: {
      name: 'Size',
      nameAr: 'الحجم',
      description: 'Product size variants',
    },
    create: {
      name: 'Size',
      nameAr: 'الحجم',
      slug: 'size',
      description: 'Product size variants',
      sortOrder: 2,
    },
  });

  // Create color values for hair care products like Toppik
  const colorValues = [
    {
      value: 'Dark Brown',
      valueAr: 'بني داكن',
      slug: 'dark-brown',
      hexColor: '#8B4513',
      image: 'https://placehold.co/100x100/8B4513/fff?text=DB',
    },
    {
      value: 'Black',
      valueAr: 'أسود',
      slug: 'black',
      hexColor: '#000000',
      image: 'https://placehold.co/100x100/000000/fff?text=BL',
    },
    {
      value: 'Light Brown',
      valueAr: 'بني فاتح',
      slug: 'light-brown',
      hexColor: '#D2B48C',
      image: 'https://placehold.co/100x100/D2B48C/000?text=LB',
    },
    {
      value: 'Auburn',
      valueAr: 'كستنائي',
      slug: 'auburn',
      hexColor: '#A52A2A',
      image: 'https://placehold.co/100x100/A52A2A/fff?text=AU',
    },
    {
      value: 'Blonde',
      valueAr: 'أشقر',
      slug: 'blonde',
      hexColor: '#FAD5A5',
      image: 'https://placehold.co/100x100/FAD5A5/000?text=BL',
    },
    {
      value: 'Gray',
      valueAr: 'رمادي',
      slug: 'gray',
      hexColor: '#808080',
      image: 'https://placehold.co/100x100/808080/fff?text=GR',
    },
  ];

  for (const colorData of colorValues) {
    await prisma.productAttributeValue.upsert({
      where: {
        attributeId_slug: {
          attributeId: colorAttribute.id,
          slug: colorData.slug,
        },
      },
      update: colorData,
      create: {
        ...colorData,
        attributeId: colorAttribute.id,
      },
    });
  }

  // Create size values
  const sizeValues = [
    {
      value: '12g',
      valueAr: '12 جرام',
      slug: '12g',
      priceAdjustment: 0,
      stockQuantity: 50,
    },
    {
      value: '27g',
      valueAr: '27 جرام',
      slug: '27g',
      priceAdjustment: 15,
      stockQuantity: 30,
    },
    {
      value: '55g',
      valueAr: '55 جرام',
      slug: '55g',
      priceAdjustment: 30,
      stockQuantity: 20,
    },
  ];

  for (const sizeData of sizeValues) {
    await prisma.productAttributeValue.upsert({
      where: {
        attributeId_slug: {
          attributeId: sizeAttribute.id,
          slug: sizeData.slug,
        },
      },
      update: sizeData,
      create: {
        ...sizeData,
        attributeId: sizeAttribute.id,
      },
    });
  }

  // Create a sample Toppik product
  const toppikProduct = await prisma.product.upsert({
    where: { slug: 'toppik-hair-building-fibers' },
    update: {
      title: 'Toppik Hair Building Fibers',
      titleAr: 'ألياف بناء الشعر توبيك',
      descriptionEn: 'Natural keratin fibers that instantly give you the appearance of thicker, fuller hair',
      descriptionAr: 'ألياف الكيراتين الطبيعية التي تمنحك فوراً مظهر شعر أكثر كثافة وامتلاءً',
      price: 35.0,
      currency: 'JOD',
      sku: 'TOPPIK-HBF',
      barcode: '123456789012',
      isFeatured: true,
      activeIngredients: 'Natural Keratin Fibers',
      usage: 'Daily',
      features: '["Instant results", "Natural looking", "Wind and rain resistant", "Undetectable"]',
      featuresAr: '["نتائج فورية", "مظهر طبيعي", "مقاوم للرياح والمطر", "غير قابل للاكتشاف"]',
      ingredients: 'Keratin, Natural Mineral Fibers',
      ingredientsAr: 'الكيراتين، ألياف معدنية طبيعية',
      howToUse: 'Shake fibers over thinning areas, gently pat down',
      howToUseAr: 'رج الألياف فوق المناطق الرقيقة، ثم ربت بلطف',
      stockQuantity: 100,
    },
    create: {
      title: 'Toppik Hair Building Fibers',
      titleAr: 'ألياف بناء الشعر توبيك',
      slug: 'toppik-hair-building-fibers',
      descriptionEn: 'Natural keratin fibers that instantly give you the appearance of thicker, fuller hair',
      descriptionAr: 'ألياف الكيراتين الطبيعية التي تمنحك فوراً مظهر شعر أكثر كثافة وامتلاءً',
      price: 35.0,
      currency: 'JOD',
      sku: 'TOPPIK-HBF',
      barcode: '123456789012',
      isFeatured: true,
      activeIngredients: 'Natural Keratin Fibers',
      usage: 'Daily',
      features: '["Instant results", "Natural looking", "Wind and rain resistant", "Undetectable"]',
      featuresAr: '["نتائج فورية", "مظهر طبيعي", "مقاوم للرياح والمطر", "غير قابل للاكتشاف"]',
      ingredients: 'Keratin, Natural Mineral Fibers',
      ingredientsAr: 'الكيراتين، ألياف معدنية طبيعية',
      howToUse: 'Shake fibers over thinning areas, gently pat down',
      howToUseAr: 'رج الألياف فوق المناطق الرقيقة، ثم ربت بلطف',
      stockQuantity: 100,
    },
  });

  console.log('✅ Product attributes seeded successfully!');
  console.log(`Created product: ${toppikProduct.title} (${toppikProduct.id})`);
  console.log(`Color attribute: ${colorAttribute.name} (${colorAttribute.id})`);
  console.log(`Size attribute: ${sizeAttribute.name} (${sizeAttribute.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
