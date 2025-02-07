/*
  Warnings:

  - You are about to drop the column `clientesId` on the `Telefones` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Telefones" DROP CONSTRAINT "Telefones_clientesId_fkey";

-- AlterTable
ALTER TABLE "Telefones" DROP COLUMN "clientesId",
ADD COLUMN     "cliente_id" INTEGER,
ALTER COLUMN "descricao" SET DEFAULT 'residencial';

-- AddForeignKey
ALTER TABLE "Telefones" ADD CONSTRAINT "Telefones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
