/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Cart" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '30 days';

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "barcode" TEXT;

-- CreateTable
CREATE TABLE "public"."ProductAttribute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductAttributeValue" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueAr" TEXT,
    "slug" TEXT NOT NULL,
    "hexColor" TEXT,
    "image" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "priceAdjustment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductAttribute_Product" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productAttributeValueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductAttribute_Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttribute_slug_key" ON "public"."ProductAttribute"("slug");

-- CreateIndex
CREATE INDEX "ProductAttribute_slug_idx" ON "public"."ProductAttribute"("slug");

-- CreateIndex
CREATE INDEX "ProductAttribute_sortOrder_idx" ON "public"."ProductAttribute"("sortOrder");

-- CreateIndex
CREATE INDEX "ProductAttributeValue_attributeId_idx" ON "public"."ProductAttributeValue"("attributeId");

-- CreateIndex
CREATE INDEX "ProductAttributeValue_slug_idx" ON "public"."ProductAttributeValue"("slug");

-- CreateIndex
CREATE INDEX "ProductAttributeValue_sortOrder_idx" ON "public"."ProductAttributeValue"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttributeValue_attributeId_slug_key" ON "public"."ProductAttributeValue"("attributeId", "slug");

-- CreateIndex
CREATE INDEX "ProductAttribute_Product_productId_idx" ON "public"."ProductAttribute_Product"("productId");

-- CreateIndex
CREATE INDEX "ProductAttribute_Product_productAttributeValueId_idx" ON "public"."ProductAttribute_Product"("productAttributeValueId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttribute_Product_productId_productAttributeValueId_key" ON "public"."ProductAttribute_Product"("productId", "productAttributeValueId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "public"."Product"("barcode");

-- AddForeignKey
ALTER TABLE "public"."ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "public"."ProductAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductAttribute_Product" ADD CONSTRAINT "ProductAttribute_Product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductAttribute_Product" ADD CONSTRAINT "ProductAttribute_Product_productAttributeValueId_fkey" FOREIGN KEY ("productAttributeValueId") REFERENCES "public"."ProductAttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
