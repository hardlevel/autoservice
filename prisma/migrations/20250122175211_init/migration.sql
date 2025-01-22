/*
  Warnings:

  - A unique constraint covering the columns `[cidade,uf,cep,ck6041_id]` on the table `Ck6042` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ck6042_cidade_uf_ck6041_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ck6042_cidade_uf_cep_ck6041_id_key" ON "Ck6042"("cidade", "uf", "cep", "ck6041_id");
