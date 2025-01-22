/*
  Warnings:

  - A unique constraint covering the columns `[numero_do_dn,numero_da_nota_fiscal]` on the table `Ck4001` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ck4001_numero_do_dn_numero_da_nota_fiscal_key" ON "Ck4001"("numero_do_dn", "numero_da_nota_fiscal");
