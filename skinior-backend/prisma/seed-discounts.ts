import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDiscountCodes() {
  console.log('Seeding discount codes...');

  // Create sample discount codes
  const discountCodes = [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minimumAmount: 0,
      usageLimit: 100,
      active: true,
      startsAt: new Date('2025-01-01'),
      endsAt: new Date('2025-12-31'),
    },
    {
      code: 'SAVE20',
      type: 'percentage',
      value: 20,
      minimumAmount: 50,
      usageLimit: 50,
      active: true,
      startsAt: new Date('2025-01-01'),
      endsAt: new Date('2025-06-30'),
    },
    {
      code: 'FREESHIP',
      type: 'fixed',
      value: 5, // $5 off shipping
      minimumAmount: 25,
      usageLimit: null, // Unlimited
      active: true,
      startsAt: new Date('2025-01-01'),
      endsAt: new Date('2025-12-31'),
    },
    {
      code: 'NEWUSER25',
      type: 'percentage',
      value: 25,
      minimumAmount: 100,
      usageLimit: 200,
      active: true,
      startsAt: new Date('2025-01-01'),
      endsAt: new Date('2025-12-31'),
    },
  ];

  for (const discountData of discountCodes) {
    await prisma.discountCode.upsert({
      where: { code: discountData.code },
      update: discountData,
      create: discountData,
    });
    console.log(`✓ Created/updated discount code: ${discountData.code}`);
  }

  console.log('Discount codes seeding completed!');
}

async function main() {
  try {
    await seedDiscountCodes();
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
