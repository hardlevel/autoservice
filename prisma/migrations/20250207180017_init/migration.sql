/*
  Warnings:

  - You are about to drop the column `clientesId` on the `Emails` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Emails" DROP CONSTRAINT "Emails_clientesId_fkey";

-- AlterTable
ALTER TABLE "Emails" DROP COLUMN "clientesId",
ADD COLUMN     "cliente_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
