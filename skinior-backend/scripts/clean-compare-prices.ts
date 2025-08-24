import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanComparePrices() {
  try {
    console.log('🔍 Checking products with compare prices...');
    
    // First, let's see how many products have compare prices equal to their regular price
    const productsWithSamePrice = await prisma.product.findMany({
      where: {
        compareAtPrice: {
          not: null
        }
      },
      select: {
        id: true,
        title: true,
        price: true,
        compareAtPrice: true
      }
    });

    console.log(`📊 Found ${productsWithSamePrice.length} products with compare prices`);
    
    // Filter products where compare price equals regular price
    const productsToClean = productsWithSamePrice.filter(product => 
      product.compareAtPrice === product.price
    );

    console.log(`🧹 Found ${productsToClean.length} products where compare price equals regular price:`);
    
    if (productsToClean.length > 0) {
      productsToClean.forEach(product => {
        console.log(`  - ${product.title}: ${product.price} JOD (compare: ${product.compareAtPrice} JOD)`);
      });

      console.log('\n🔄 Cleaning up compare prices...');
      
      // Update products using individual updates (safer for floating point comparison)
      let cleanedCount = 0;
      for (const product of productsToClean) {
        await prisma.product.update({
          where: { id: product.id },
          data: { compareAtPrice: null }
        });
        cleanedCount++;
      }

      console.log(`✅ Successfully cleaned ${cleanedCount} products`);
    } else {
      console.log('✅ No products need cleaning - all compare prices are different from regular prices');
    }

    // Show final statistics
    const finalStats = await prisma.product.aggregate({
      _count: {
        compareAtPrice: true
      },
      where: {
        compareAtPrice: {
          not: null
        }
      }
    });

    console.log(`\n📈 Final statistics:`);
    console.log(`  - Products with valid compare prices: ${finalStats._count.compareAtPrice}`);
    
    // Show some examples of remaining valid compare prices
    const validComparePrices = await prisma.product.findMany({
      where: {
        compareAtPrice: {
          not: null
        }
      },
      select: {
        title: true,
        price: true,
        compareAtPrice: true
      },
      take: 5
    });

    if (validComparePrices.length > 0) {
      console.log(`\n💰 Examples of valid compare prices:`);
      validComparePrices.forEach(product => {
        const discount = ((product.compareAtPrice! - product.price) / product.compareAtPrice! * 100).toFixed(1);
        console.log(`  - ${product.title}: ${product.price} JOD (was ${product.compareAtPrice} JOD) - ${discount}% off`);
      });
    }

  } catch (error) {
    console.error('❌ Error cleaning compare prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Alternative approach using raw SQL for exact floating point comparison
async function cleanComparePricesWithSQL() {
  try {
    console.log('\n🔧 Using SQL approach for precise floating point comparison...');
    
    // Find products where compare price equals price using SQL
    const productsToClean = await prisma.$queryRaw<Array<{
      id: string;
      title: string;
      price: number;
      compareAtPrice: number;
    }>>`
      SELECT id, title, price, "compareAtPrice"
      FROM "Product"
      WHERE "compareAtPrice" IS NOT NULL
      AND "compareAtPrice" = price
    `;

    console.log(`🧹 Found ${productsToClean.length} products to clean using SQL approach:`);
    
    if (productsToClean.length > 0) {
      productsToClean.forEach(product => {
        console.log(`  - ${product.title}: ${product.price} JOD`);
      });

      // Update using raw SQL
      const result = await prisma.$executeRaw`
        UPDATE "Product"
        SET "compareAtPrice" = NULL
        WHERE "compareAtPrice" IS NOT NULL
        AND "compareAtPrice" = price
      `;

      console.log(`✅ Successfully cleaned ${result} products using SQL`);
    } else {
      console.log('✅ No products need cleaning');
    }

  } catch (error) {
    console.error('❌ Error with SQL approach:', error);
  }
}

async function main() {
  console.log('🚀 Starting compare price cleanup script...\n');
  
  // Try the SQL approach first (more reliable for floating point comparison)
  await cleanComparePricesWithSQL();
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Compare price cleanup completed!');
}

main()
  .catch((e) => {
    console.error('❌ Script failed:', e);
    process.exit(1);
  });
