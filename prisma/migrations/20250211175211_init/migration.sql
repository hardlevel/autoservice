/*
  Warnings:

  - A unique constraint covering the columns `[id_nf,id_cla_cliente]` on the table `tb_cad_cadastro_nfs_clientes_classificacao` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_clientes_classificacao_id_nf_id_cla_cli_key" ON "tb_cad_cadastro_nfs_clientes_classificacao"("id_nf", "id_cla_cliente");
