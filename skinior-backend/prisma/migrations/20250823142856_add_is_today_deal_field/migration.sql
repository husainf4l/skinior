-- AlterTable
ALTER TABLE "public"."Cart" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '30 days';

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "isTodayDeal" BOOLEAN NOT NULL DEFAULT false;
