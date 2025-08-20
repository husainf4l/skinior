-- AlterTable
ALTER TABLE "public"."Cart" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '30 days';

-- CreateTable
CREATE TABLE "public"."LiveKitRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metadata" JSONB,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveKitRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveKitRoom_name_key" ON "public"."LiveKitRoom"("name");
