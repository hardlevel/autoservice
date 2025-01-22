/*
  Warnings:

  - A unique constraint covering the columns `[chassi_do_veiculo,ck6011_id]` on the table `Ck6041` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ck6041_chassi_do_veiculo_placa_do_veiculo_ck6011_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ck6041_chassi_do_veiculo_ck6011_id_key" ON "Ck6041"("chassi_do_veiculo", "ck6011_id");
