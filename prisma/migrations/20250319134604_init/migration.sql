/*
  Warnings:

  - You are about to drop the column `day` on the `LastSearch` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `LastSearch` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `LastSearch` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `LastSearch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LastSearch" DROP COLUMN "day",
DROP COLUMN "hour",
DROP COLUMN "month",
DROP COLUMN "year",
ALTER COLUMN "id" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "LastParams" (
    "id" INTEGER NOT NULL DEFAULT 1
);

-- CreateIndex
CREATE UNIQUE INDEX "LastParams_id_key" ON "LastParams"("id");
