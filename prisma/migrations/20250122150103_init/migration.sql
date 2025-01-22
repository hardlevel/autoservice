/*
  Warnings:

  - A unique constraint covering the columns `[numero]` on the table `Telefones` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Telefones_numero_ck3002_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Telefones_numero_key" ON "Telefones"("numero");
