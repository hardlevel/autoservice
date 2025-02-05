/*
  Warnings:

  - A unique constraint covering the columns `[nome_do_cliente,chassi_do_veiculo,ck6011_id]` on the table `Ck6041` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ck6041_nome_do_cliente_chassi_do_veiculo_ck6011_id_key" ON "Ck6041"("nome_do_cliente", "chassi_do_veiculo", "ck6011_id");
