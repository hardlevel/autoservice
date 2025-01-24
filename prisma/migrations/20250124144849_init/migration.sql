/*
  Warnings:

  - A unique constraint covering the columns `[numero_do_dn,ano_de_referencia,mes_de_referencia]` on the table `Ck5001` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ck5001_numero_do_dn_ano_de_referencia_mes_de_referencia_key" ON "Ck5001"("numero_do_dn", "ano_de_referencia", "mes_de_referencia");
