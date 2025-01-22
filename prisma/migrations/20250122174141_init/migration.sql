/*
  Warnings:

  - You are about to drop the column `ck6011_id` on the `Ck6042` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cidade,uf,ck6041_id]` on the table `Ck6042` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ck6041_id` to the `Ck6042` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ck6042" DROP CONSTRAINT "Ck6042_ck6011_id_fkey";

-- DropIndex
DROP INDEX "Ck6042_cidade_uf_ck6011_id_key";

-- AlterTable
ALTER TABLE "Ck6042" DROP COLUMN "ck6011_id",
ADD COLUMN     "ck6011Id" INTEGER,
ADD COLUMN     "ck6041_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ck6042_cidade_uf_ck6041_id_key" ON "Ck6042"("cidade", "uf", "ck6041_id");

-- AddForeignKey
ALTER TABLE "Ck6042" ADD CONSTRAINT "Ck6042_ck6041_id_fkey" FOREIGN KEY ("ck6041_id") REFERENCES "Ck6041"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck6042" ADD CONSTRAINT "Ck6042_ck6011Id_fkey" FOREIGN KEY ("ck6011Id") REFERENCES "Ck6011"("id") ON DELETE SET NULL ON UPDATE CASCADE;
