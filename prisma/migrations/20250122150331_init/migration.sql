/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Emails` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Emails_email_ck3002_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Emails_email_key" ON "Emails"("email");
