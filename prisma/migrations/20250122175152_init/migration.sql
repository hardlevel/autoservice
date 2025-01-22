/*
  Warnings:

  - Added the required column `cep` to the `Ck6042` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ck6042" ADD COLUMN     "cep" TEXT NOT NULL;
