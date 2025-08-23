# Product Attributes Enhancement

## What was added:

### 1. Product Model Enhancements

- **Barcode field**: Added `barcode String? @unique` to the Product model for product identification
- **Attribute relationships**: Added support for product variants through attribute values

### 2. New Models

#### ProductAttribute

- Defines attribute types (Color, Size, Material, etc.)
- Fields: name, nameAr, slug, description, isActive, sortOrder
- Supports Arabic translations

#### ProductAttributeValue

- Defines specific attribute values (Dark Brown, Black, 12g, 27g, etc.)
- Fields: value, valueAr, slug, hexColor, image, priceAdjustment, stockQuantity
- **hexColor**: For color attributes (e.g., "#8B4513" for dark brown)
- **image**: URL to image showing the attribute (e.g., color swatch)
- **priceAdjustment**: Price difference for this variant (+/- from base price)
- **stockQuantity**: Individual stock tracking per variant

#### ProductAttribute_Product (Junction Table)

- Links products to their available attribute values
- Many-to-many relationship between Product and ProductAttributeValue

### 3. Sample Data Created

#### Hair Care Product (Toppik)

- Product: "Toppik Hair Building Fibers"
- Barcode: "123456789012"
- Base price: 35 JOD

#### Color Attributes

- Dark Brown (#8B4513) with color swatch image
- Black (#000000) with color swatch image
- Light Brown (#D2B48C)
- Auburn (#A52A2A)
- Blonde (#FAD5A5)
- Gray (#808080)

#### Size Attributes

- 12g (base price, 50 in stock)
- 27g (+15 JOD, 30 in stock)
- 55g (+30 JOD, 20 in stock)

## Database Structure

```prisma
Product {
  id String
  title String
  barcode String? @unique  // NEW
  price Float
  // ... existing fields
  attributeValues ProductAttribute_Product[] // NEW
}

ProductAttribute {
  id String
  name String          // "Color", "Size"
  nameAr String?       // "اللون", "الحجم"
  slug String @unique  // "color", "size"
  values ProductAttributeValue[]
}

ProductAttributeValue {
  id String
  attributeId String
  value String         // "Dark Brown", "12g"
  valueAr String?      // "بني داكن", "12 جرام"
  slug String          // "dark-brown", "12g"
  hexColor String?     // "#8B4513" for colors
  image String?        // Color swatch image URL
  priceAdjustment Float @default(0)  // +/- price
  stockQuantity Int @default(0)      // Stock per variant
  products ProductAttribute_Product[]
}
```

## Query Examples

### Fetch Product with Attributes

```typescript
const product = await prisma.product.findUnique({
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
  },
});
```

### Frontend Usage Examples

- **Product Variants**: Show color swatches with images
- **Price Calculator**: Base price + selected variant adjustments
- **Stock Management**: Track inventory per color/size combination
- **Barcode Scanning**: Quick product lookup via barcode
- **Multi-language**: Arabic names for attributes and values

## Files Created

- `prisma/seed-attributes.ts` - Seeds attribute types and values
- `prisma/link-attributes.ts` - Links products to attributes
- `scripts/query-product-attributes.ts` - Demonstrates data retrieval

## Migration Applied

- `20250822175439_add_product_attributes_and_barcode` - Database schema update
