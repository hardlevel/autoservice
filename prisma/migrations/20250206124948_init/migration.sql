/*
  Warnings:

  - Made the column `nome` on table `tb_cad_cadastro_nfs_cliente` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome` on table `tb_cad_cadastro_os_clientes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_cliente" ALTER COLUMN "nome" SET NOT NULL;

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_clientes" ALTER COLUMN "nome" SET NOT NULL;
