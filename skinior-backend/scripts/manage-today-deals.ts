import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listTodayDeals() {
  console.log('📋 Current Today\'s Deals:');
  const deals = await prisma.product.findMany({
    where: {
      isTodayDeal: true,
      isActive: true,
    },
    select: {
      id: true,
      title: true,
      price: true,
      compareAtPrice: true,
      isTodayDeal: true,
      brand: { select: { name: true } },
    },
  });

  if (deals.length === 0) {
    console.log('  No products are currently marked as today\'s deals');
    return;
  }

  deals.forEach((deal, index) => {
    const discount = deal.compareAtPrice && deal.compareAtPrice > deal.price 
      ? `${Math.round(((deal.compareAtPrice - deal.price) / deal.compareAtPrice) * 100)}% OFF`
      : 'No discount info';
    console.log(`  ${index + 1}. ${deal.title} (${deal.brand?.name || 'No brand'})`);
    console.log(`     Price: ${deal.price} JOD (was ${deal.compareAtPrice || 'N/A'} JOD) - ${discount}`);
    console.log(`     ID: ${deal.id}`);
    console.log('');
  });
}

async function setTodayDeal(productId: string, isTodayDeal: boolean) {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { isTodayDeal },
      select: { title: true, isTodayDeal: true },
    });
    
    console.log(`✅ Updated "${product.title}" - isTodayDeal: ${product.isTodayDeal}`);
  } catch (error) {
    console.error('❌ Error updating product:', error);
  }
}

async function findProductsWithDeals() {
  console.log('🔍 Products with compareAtPrice > price (potential deals):');
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      compareAtPrice: { not: null },
    },
    select: {
      id: true,
      title: true,
      price: true,
      compareAtPrice: true,
      isTodayDeal: true,
      brand: { select: { name: true } },
    },
  });

  const validDeals = products.filter(p => 
    p.compareAtPrice && p.compareAtPrice > p.price
  );

  if (validDeals.length === 0) {
    console.log('  No products found with valid deal pricing');
    return;
  }

  validDeals.forEach((deal, index) => {
    const discount = Math.round(((deal.compareAtPrice! - deal.price) / deal.compareAtPrice!) * 100);
    const isMarked = deal.isTodayDeal ? '✅' : '❌';
    console.log(`  ${index + 1}. ${deal.title} (${deal.brand?.name || 'No brand'})`);
    console.log(`     Price: ${deal.price} JOD (was ${deal.compareAtPrice} JOD) - ${discount}% OFF`);
    console.log(`     Today's Deal: ${isMarked} ${deal.isTodayDeal}`);
    console.log(`     ID: ${deal.id}`);
    console.log('');
  });
}

async function main() {
  const command = process.argv[2];
  const productId = process.argv[3];
  const value = process.argv[4];

  switch (command) {
    case 'list':
      await listTodayDeals();
      break;
    case 'set':
      if (!productId || !value) {
        console.log('Usage: npm run script manage-today-deals.ts set <productId> <true|false>');
        return;
      }
      await setTodayDeal(productId, value === 'true');
      break;
    case 'find':
      await findProductsWithDeals();
      break;
    default:
      console.log('Commands:');
      console.log('  list  - List all products marked as today\'s deals');
      console.log('  find  - Find products with deal pricing (compareAtPrice > price)');
      console.log('  set <productId> <true|false>  - Mark/unmark a product as today\'s deal');
      console.log('');
      console.log('Examples:');
      console.log('  tsx scripts/manage-today-deals.ts list');
      console.log('  tsx scripts/manage-today-deals.ts find');
      console.log('  tsx scripts/manage-today-deals.ts set 00023cd2-7483-47fa-89ae-9e6995490e7b true');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
