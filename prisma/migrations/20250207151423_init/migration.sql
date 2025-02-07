/*
  Warnings:

  - You are about to drop the column `notaFiscalId` on the `Cancelamentos` table. All the data in the column will be lost.
  - You are about to drop the column `osId` on the `Cancelamentos` table. All the data in the column will be lost.
  - You are about to drop the column `osId` on the `Clientes` table. All the data in the column will be lost.
  - You are about to drop the column `notaFiscalId` on the `FontesPagadoras` table. All the data in the column will be lost.
  - You are about to drop the column `numero_nf` on the `NotaFiscal` table. All the data in the column will be lost.
  - You are about to drop the column `notaFiscalId` on the `Pecas` table. All the data in the column will be lost.
  - You are about to drop the column `osId` on the `Pecas` table. All the data in the column will be lost.
  - You are about to drop the column `osId` on the `Servicos` table. All the data in the column will be lost.
  - You are about to drop the column `osId` on the `Veiculos` table. All the data in the column will be lost.
  - You are about to drop the `Os` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `indicador` to the `NotaFiscal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `NotaFiscal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serie` to the `NotaFiscal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cancelamentos" DROP CONSTRAINT "Cancelamentos_notaFiscalId_fkey";

-- DropForeignKey
ALTER TABLE "Cancelamentos" DROP CONSTRAINT "Cancelamentos_osId_fkey";

-- DropForeignKey
ALTER TABLE "Clientes" DROP CONSTRAINT "Clientes_osId_fkey";

-- DropForeignKey
ALTER TABLE "FontesPagadoras" DROP CONSTRAINT "FontesPagadoras_notaFiscalId_fkey";

-- DropForeignKey
ALTER TABLE "Os" DROP CONSTRAINT "Os_id_nf_fkey";

-- DropForeignKey
ALTER TABLE "Pecas" DROP CONSTRAINT "Pecas_notaFiscalId_fkey";

-- DropForeignKey
ALTER TABLE "Pecas" DROP CONSTRAINT "Pecas_osId_fkey";

-- DropForeignKey
ALTER TABLE "Servicos" DROP CONSTRAINT "Servicos_osId_fkey";

-- DropForeignKey
ALTER TABLE "Veiculos" DROP CONSTRAINT "Veiculos_osId_fkey";

-- AlterTable
ALTER TABLE "Cancelamentos" DROP COLUMN "notaFiscalId",
DROP COLUMN "osId",
ADD COLUMN     "nf_id" INTEGER,
ADD COLUMN     "os_id" INTEGER;

-- AlterTable
ALTER TABLE "Clientes" DROP COLUMN "osId";

-- AlterTable
ALTER TABLE "FontesPagadoras" DROP COLUMN "notaFiscalId",
ADD COLUMN     "nf_id" INTEGER;

-- AlterTable
ALTER TABLE "NotaFiscal" DROP COLUMN "numero_nf",
ADD COLUMN     "clientesId" INTEGER,
ADD COLUMN     "dealer_id" INTEGER,
ADD COLUMN     "indicador" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "serie" TEXT NOT NULL,
ADD COLUMN     "valor_total_mo" DECIMAL(65,30),
ADD COLUMN     "valor_total_pecas" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Pecas" DROP COLUMN "notaFiscalId",
DROP COLUMN "osId",
ADD COLUMN     "nf_id" INTEGER,
ADD COLUMN     "os_id" INTEGER;

-- AlterTable
ALTER TABLE "Servicos" DROP COLUMN "osId",
ADD COLUMN     "os_id" INTEGER;

-- AlterTable
ALTER TABLE "Veiculos" DROP COLUMN "osId",
ADD COLUMN     "os_id" INTEGER;

-- DropTable
DROP TABLE "Os";

-- CreateTable
CREATE TABLE "OrdemDeServico" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "data_abertura" TIMESTAMP(3) NOT NULL,
    "data_fechamento" TIMESTAMP(3),
    "valor_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "nf_id" INTEGER NOT NULL,
    "dealer_id" INTEGER,

    CONSTRAINT "OrdemDeServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientesToOrdemDeServico" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClientesToOrdemDeServico_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrdemDeServico_numero_key" ON "OrdemDeServico"("numero");

-- CreateIndex
CREATE INDEX "_ClientesToOrdemDeServico_B_index" ON "_ClientesToOrdemDeServico"("B");

-- AddForeignKey
ALTER TABLE "OrdemDeServico" ADD CONSTRAINT "OrdemDeServico_nf_id_fkey" FOREIGN KEY ("nf_id") REFERENCES "NotaFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemDeServico" ADD CONSTRAINT "OrdemDeServico_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "Dealers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaFiscal" ADD CONSTRAINT "NotaFiscal_clientesId_fkey" FOREIGN KEY ("clientesId") REFERENCES "Clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaFiscal" ADD CONSTRAINT "NotaFiscal_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "Dealers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pecas" ADD CONSTRAINT "Pecas_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OrdemDeServico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pecas" ADD CONSTRAINT "Pecas_nf_id_fkey" FOREIGN KEY ("nf_id") REFERENCES "NotaFiscal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicos" ADD CONSTRAINT "Servicos_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OrdemDeServico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veiculos" ADD CONSTRAINT "Veiculos_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OrdemDeServico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancelamentos" ADD CONSTRAINT "Cancelamentos_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OrdemDeServico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancelamentos" ADD CONSTRAINT "Cancelamentos_nf_id_fkey" FOREIGN KEY ("nf_id") REFERENCES "NotaFiscal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FontesPagadoras" ADD CONSTRAINT "FontesPagadoras_nf_id_fkey" FOREIGN KEY ("nf_id") REFERENCES "NotaFiscal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientesToOrdemDeServico" ADD CONSTRAINT "_ClientesToOrdemDeServico_A_fkey" FOREIGN KEY ("A") REFERENCES "Clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientesToOrdemDeServico" ADD CONSTRAINT "_ClientesToOrdemDeServico_B_fkey" FOREIGN KEY ("B") REFERENCES "OrdemDeServico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
