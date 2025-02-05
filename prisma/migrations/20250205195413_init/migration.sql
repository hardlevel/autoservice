/*
  Warnings:

  - A unique constraint covering the columns `[os_id,id_peca]` on the table `tb_cad_cadastro_os_pecas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_pecas_os_id_id_peca_key" ON "tb_cad_cadastro_os_pecas"("os_id", "id_peca");
