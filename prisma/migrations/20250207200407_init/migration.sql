/*
  Warnings:

  - You are about to drop the column `clientesId` on the `NotaFiscal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotaFiscal" DROP CONSTRAINT "NotaFiscal_clientesId_fkey";

-- AlterTable
ALTER TABLE "NotaFiscal" DROP COLUMN "clientesId",
ADD COLUMN     "cliente_id" INTEGER,
ALTER COLUMN "valor_total" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "NotaFiscal" ADD CONSTRAINT "NotaFiscal_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
