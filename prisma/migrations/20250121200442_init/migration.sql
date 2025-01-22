/*
  Warnings:

  - A unique constraint covering the columns `[email,ck3002_id]` on the table `Emails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero,ck3002_id]` on the table `Telefones` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Emails_email_ck3002_id_key" ON "Emails"("email", "ck3002_id");

-- CreateIndex
CREATE UNIQUE INDEX "Telefones_numero_ck3002_id_key" ON "Telefones"("numero", "ck3002_id");
