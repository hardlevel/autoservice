/*
  Warnings:

  - A unique constraint covering the columns `[cpf_cnpj]` on the table `Clientes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero]` on the table `NotaFiscal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[os_id]` on the table `Pecas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nf_id]` on the table `Pecas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Clientes_cpf_cnpj_key" ON "Clientes"("cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "NotaFiscal_numero_key" ON "NotaFiscal"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Pecas_os_id_key" ON "Pecas"("os_id");

-- CreateIndex
CREATE UNIQUE INDEX "Pecas_nf_id_key" ON "Pecas"("nf_id");
