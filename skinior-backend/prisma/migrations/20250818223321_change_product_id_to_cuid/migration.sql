/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductReview" DROP CONSTRAINT "ProductReview_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- AlterTable
ALTER TABLE "public"."ProductImage" ALTER COLUMN "productId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."ProductReview" ALTER COLUMN "productId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
