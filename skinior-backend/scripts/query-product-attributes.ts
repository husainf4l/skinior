import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Fetching product with attributes...\n');

  // Fetch product with all its attribute values
  const productWithAttributes = await prisma.product.findUnique({
    where: { slug: 'toppik-hair-building-fibers' },
    include: {
      attributeValues: {
        include: {
          attributeValue: {
            include: {
              attribute: true,
            },
          },
        },
      },
      images: true,
      category: true,
      brand: true,
    },
  });

  if (!productWithAttributes) {
    console.log('❌ Product not found');
    return;
  }

  console.log(`🛍️  Product: ${productWithAttributes.title}`);
  console.log(`💰 Price: ${productWithAttributes.price} ${productWithAttributes.currency}`);
  console.log(`📦 SKU: ${productWithAttributes.sku}`);
  console.log(`🔢 Barcode: ${productWithAttributes.barcode}`);
  console.log(`📊 Stock: ${productWithAttributes.stockQuantity}\n`);

  // Group attributes by type
  const attributesByType: Record<string, any[]> = {};
  
  productWithAttributes.attributeValues.forEach(({ attributeValue }) => {
    const attrName = attributeValue.attribute.name;
    if (!attributesByType[attrName]) {
      attributesByType[attrName] = [];
    }
    attributesByType[attrName].push(attributeValue);
  });

  console.log('🎨 Available Attributes:');
  Object.entries(attributesByType).forEach(([attrType, values]) => {
    console.log(`\n  ${attrType}:`);
    values.forEach(value => {
      const priceAdjustment = value.priceAdjustment > 0 ? ` (+${value.priceAdjustment} JOD)` : '';
      const hexColor = value.hexColor ? ` (${value.hexColor})` : '';
      const stock = value.stockQuantity > 0 ? ` [${value.stockQuantity} in stock]` : '';
      const image = value.image ? ` 🖼️` : '';
      console.log(`    - ${value.value}${hexColor}${priceAdjustment}${stock}${image}`);
    });
  });

  console.log('\n✅ Query completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
