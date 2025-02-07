/*
  Warnings:

  - A unique constraint covering the columns `[nf_id,codigo]` on the table `Pecas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[os_id,codigo]` on the table `Pecas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Pecas_nf_id_os_id_codigo_key";

-- CreateIndex
CREATE UNIQUE INDEX "Pecas_nf_id_codigo_key" ON "Pecas"("nf_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Pecas_os_id_codigo_key" ON "Pecas"("os_id", "codigo");
