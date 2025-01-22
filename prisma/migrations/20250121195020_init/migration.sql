/*
  Warnings:

  - You are about to drop the column `email_comercial` on the `Ck3002` table. All the data in the column will be lost.
  - You are about to drop the column `email_pessoal` on the `Ck3002` table. All the data in the column will be lost.
  - You are about to drop the column `telefone_celular` on the `Ck3002` table. All the data in the column will be lost.
  - You are about to drop the column `telefone_comercial` on the `Ck3002` table. All the data in the column will be lost.
  - You are about to drop the column `telefone_residencial` on the `Ck3002` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cidade,bairro,uf,cep,ck3001_id]` on the table `Ck3002` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ck3002" DROP COLUMN "email_comercial",
DROP COLUMN "email_pessoal",
DROP COLUMN "telefone_celular",
DROP COLUMN "telefone_comercial",
DROP COLUMN "telefone_residencial";

-- CreateIndex
CREATE UNIQUE INDEX "Ck3002_cidade_bairro_uf_cep_ck3001_id_key" ON "Ck3002"("cidade", "bairro", "uf", "cep", "ck3001_id");
