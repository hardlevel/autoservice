/*
  Warnings:

  - You are about to drop the column `id` on the `LastParams` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LastParams_id_key";

-- AlterTable
ALTER TABLE "LastParams" DROP COLUMN "id";
