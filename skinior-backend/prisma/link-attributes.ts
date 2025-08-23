import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔗 Linking product with attributes...');

  // Find the Toppik product
  const toppikProduct = await prisma.product.findUnique({
    where: { slug: 'toppik-hair-building-fibers' },
  });

  if (!toppikProduct) {
    console.log('❌ Toppik product not found');
    return;
  }

  // Find some attribute values to link
  const darkBrownColor = await prisma.productAttributeValue.findFirst({
    where: { 
      slug: 'dark-brown',
      attribute: { slug: 'color' }
    },
  });

  const blackColor = await prisma.productAttributeValue.findFirst({
    where: { 
      slug: 'black',
      attribute: { slug: 'color' }
    },
  });

  const size12g = await prisma.productAttributeValue.findFirst({
    where: { 
      slug: '12g',
      attribute: { slug: 'size' }
    },
  });

  const size27g = await prisma.productAttributeValue.findFirst({
    where: { 
      slug: '27g',
      attribute: { slug: 'size' }
    },
  });

  // Link product with attributes
  const attributesToLink = [darkBrownColor, blackColor, size12g, size27g].filter(Boolean);

  for (const attr of attributesToLink) {
    if (attr) {
      await prisma.productAttribute_Product.upsert({
        where: {
          productId_productAttributeValueId: {
            productId: toppikProduct.id,
            productAttributeValueId: attr.id,
          },
        },
        update: {},
        create: {
          productId: toppikProduct.id,
          productAttributeValueId: attr.id,
        },
      });
      console.log(`✅ Linked ${toppikProduct.title} with ${attr.value}`);
    }
  }

  console.log('🎉 Product attributes linked successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
