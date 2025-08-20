-- AlterTable
ALTER TABLE "public"."Cart" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '30 days';

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "codNotes" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'stripe',
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "stripePaymentIntentId" TEXT;
