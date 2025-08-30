/*
  Warnings:

  - You are about to drop the column `interests` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `waitlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."waitlist" DROP COLUMN "interests",
DROP COLUMN "isActive",
DROP COLUMN "isVerified",
DROP COLUMN "phone",
DROP COLUMN "source";
