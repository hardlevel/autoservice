/*
  Warnings:

  - A unique constraint covering the columns `[numero_dn,numero_os]` on the table `tb_cad_cadastro_nfs_os_cancelamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero_dn,numero_nf]` on the table `tb_cad_cadastro_nfs_os_cancelamento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_os_cancelamento_numero_dn_numero_os_key" ON "tb_cad_cadastro_nfs_os_cancelamento"("numero_dn", "numero_os");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_os_cancelamento_numero_dn_numero_nf_key" ON "tb_cad_cadastro_nfs_os_cancelamento"("numero_dn", "numero_nf");
