/*
  Warnings:

  - Added the required column `cpf_cnpj` to the `Ck3001` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_do_cliente` to the `Ck3001` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ck3001" ADD COLUMN     "cpf_cnpj" TEXT NOT NULL,
ADD COLUMN     "nome_do_cliente" TEXT NOT NULL;
