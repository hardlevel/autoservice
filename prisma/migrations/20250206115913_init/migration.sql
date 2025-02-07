/*
  Warnings:

  - A unique constraint covering the columns `[id_nf]` on the table `tb_cad_cadastro_nfs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_id_nf_key" ON "tb_cad_cadastro_nfs"("id_nf");
