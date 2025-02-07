/*
  Warnings:

  - A unique constraint covering the columns `[nome,cpf_cnpj]` on the table `tb_cad_cadastro_nfs_cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_cliente_nome_cpf_cnpj_key" ON "tb_cad_cadastro_nfs_cliente"("nome", "cpf_cnpj");
