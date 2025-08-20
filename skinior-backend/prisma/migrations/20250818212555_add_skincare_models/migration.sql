-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "slug" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionAr" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "compareAtPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'JOD',
    "sku" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "activeIngredients" TEXT,
    "skinType" TEXT,
    "concerns" TEXT,
    "usage" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "salesCount" INTEGER NOT NULL DEFAULT 0,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "isHover" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductReview" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER,
    "customerName" TEXT,
    "email" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "public"."Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
