/*
  Warnings:

  - You are about to drop the column `endDate` on the `ErrorLog` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `ErrorLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ErrorLog" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "params" TEXT;
