/*
  Warnings:

  - You are about to drop the `_ClientesToOrdemDeServico` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClientesToOrdemDeServico" DROP CONSTRAINT "_ClientesToOrdemDeServico_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientesToOrdemDeServico" DROP CONSTRAINT "_ClientesToOrdemDeServico_B_fkey";

-- AlterTable
ALTER TABLE "OrdemDeServico" ADD COLUMN     "clientesId" INTEGER;

-- DropTable
DROP TABLE "_ClientesToOrdemDeServico";

-- AddForeignKey
ALTER TABLE "OrdemDeServico" ADD CONSTRAINT "OrdemDeServico_clientesId_fkey" FOREIGN KEY ("clientesId") REFERENCES "Clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
