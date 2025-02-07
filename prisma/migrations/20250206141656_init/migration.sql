/*
  Warnings:

  - A unique constraint covering the columns `[id_cos]` on the table `tb_cad_cadastro_nfs_servicos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_servicos_id_cos_key" ON "tb_cad_cadastro_nfs_servicos"("id_cos");
