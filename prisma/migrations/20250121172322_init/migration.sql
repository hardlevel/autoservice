/*
  Warnings:

  - A unique constraint covering the columns `[cpf_cnpj,numero_da_nota_fiscal]` on the table `Ck3001` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ck3001_cpf_cnpj_numero_da_nota_fiscal_key" ON "Ck3001"("cpf_cnpj", "numero_da_nota_fiscal");
