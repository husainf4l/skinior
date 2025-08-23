-- AlterTable
ALTER TABLE "public"."Cart" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '30 days';
