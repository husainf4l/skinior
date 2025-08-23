import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDealsData() {
  try {
    console.log('🎯 Creating deals data...');

    // Get some existing products to update with deals
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 5, // Get first 5 products
    });

    if (products.length === 0) {
      console.log('❌ No products found. Please ensure you have products in the database first.');
      return;
    }

    // Update products with compareAtPrice to create deals
    const deals = [
      { percentage: 20, originalPrice: 50 }, // 20% off, was 50, now 40
      { percentage: 30, originalPrice: 75 }, // 30% off, was 75, now 52.5
      { percentage: 15, originalPrice: 30 }, // 15% off, was 30, now 25.5
      { percentage: 25, originalPrice: 100 }, // 25% off, was 100, now 75
      { percentage: 10, originalPrice: 60 }, // 10% off, was 60, now 54
    ];

    for (let i = 0; i < Math.min(products.length, deals.length); i++) {
      const product = products[i];
      const deal = deals[i];
      const discountedPrice = deal.originalPrice * (1 - deal.percentage / 100);

      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: discountedPrice,
          compareAtPrice: deal.originalPrice,
          updatedAt: new Date(),
        },
      });

      console.log(`✅ Created deal for "${product.title}": ${deal.percentage}% off (${deal.originalPrice} → ${discountedPrice.toFixed(2)} ${product.currency})`);
    }

    console.log('\n🎉 Deals data created successfully!');
    console.log(`📊 Total deals created: ${Math.min(products.length, deals.length)}`);
    console.log('\n🔗 Test the endpoint:');
    console.log('GET http://localhost:4008/api/products/deals/today');
    console.log('GET http://localhost:4008/api/products/deals/today?limit=10&offset=0');

  } catch (error) {
    console.error('❌ Error creating deals data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDealsData();
