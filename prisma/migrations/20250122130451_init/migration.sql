/*
  Warnings:

  - A unique constraint covering the columns `[codigo_da_peca,ck3001_id]` on the table `Ck3003` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ck3003_codigo_da_peca_ck3001_id_key" ON "Ck3003"("codigo_da_peca", "ck3001_id");
