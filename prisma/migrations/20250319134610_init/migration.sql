/*
  Warnings:

  - Added the required column `day` to the `LastParams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hour` to the `LastParams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `LastParams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `LastParams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LastParams" ADD COLUMN     "day" INTEGER NOT NULL,
ADD COLUMN     "hour" INTEGER NOT NULL,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
