/*
  Warnings:

  - A unique constraint covering the columns `[chassi_do_veiculo]` on the table `Ck6041` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[placa_do_veiculo]` on the table `Ck6041` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ck6041_chassi_do_veiculo_ck6011_id_key";

-- AlterTable
ALTER TABLE "Ck6041" ALTER COLUMN "chassi_do_veiculo" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ck6041_chassi_do_veiculo_key" ON "Ck6041"("chassi_do_veiculo");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6041_placa_do_veiculo_key" ON "Ck6041"("placa_do_veiculo");
