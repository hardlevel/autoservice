/*
  Warnings:

  - A unique constraint covering the columns `[tb_cad_cadastro_nfsId,id_peca]` on the table `tb_cad_cadastro_nfs_pecas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_pecas_tb_cad_cadastro_nfsId_id_peca_key" ON "tb_cad_cadastro_nfs_pecas"("tb_cad_cadastro_nfsId", "id_peca");
