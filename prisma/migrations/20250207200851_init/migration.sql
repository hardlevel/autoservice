/*
  Warnings:

  - You are about to drop the column `clientesId` on the `OrdemDeServico` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrdemDeServico" DROP CONSTRAINT "OrdemDeServico_clientesId_fkey";

-- AlterTable
ALTER TABLE "OrdemDeServico" DROP COLUMN "clientesId",
ADD COLUMN     "clientes_id" INTEGER;

-- AddForeignKey
ALTER TABLE "OrdemDeServico" ADD CONSTRAINT "OrdemDeServico_clientes_id_fkey" FOREIGN KEY ("clientes_id") REFERENCES "Clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
