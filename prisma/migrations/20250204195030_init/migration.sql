/*
  Warnings:

  - A unique constraint covering the columns `[numero_do_dn,data_do_cancelamento_do_documento]` on the table `Ck4001` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ck4001_numero_do_dn_numero_da_nota_fiscal_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ck4001_numero_do_dn_data_do_cancelamento_do_documento_key" ON "Ck4001"("numero_do_dn", "data_do_cancelamento_do_documento");
