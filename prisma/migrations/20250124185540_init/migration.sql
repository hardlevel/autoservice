/*
  Warnings:

  - You are about to drop the column `ck6011Id` on the `Ck6042` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ck6042" DROP CONSTRAINT "Ck6042_ck6011Id_fkey";

-- AlterTable
ALTER TABLE "Ck6042" DROP COLUMN "ck6011Id";
