/*
  Warnings:

  - A unique constraint covering the columns `[dn]` on the table `Dealers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dealers_dn_key" ON "Dealers"("dn");
