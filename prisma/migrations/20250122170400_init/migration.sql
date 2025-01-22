/*
  Warnings:

  - Made the column `modified_at` on table `Ck3001` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck3002` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck3003` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck4001` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck5001` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck6011` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck6021` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck6031` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck6041` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck6042` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck7001` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck7002` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck7003` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Ck7004` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Emails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_at` on table `Telefones` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ck3001" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck3002" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck3003" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck4001" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck5001" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck6011" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck6021" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck6031" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck6041" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck6042" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck7001" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck7002" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck7003" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ck7004" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Emails" ALTER COLUMN "modified_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Telefones" ALTER COLUMN "modified_at" SET NOT NULL;
