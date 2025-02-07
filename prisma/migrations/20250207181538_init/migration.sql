/*
  Warnings:

  - A unique constraint covering the columns `[nf_id,os_id,codigo]` on the table `Pecas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `Pecas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Pecas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qtd` to the `Pecas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_total` to the `Pecas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_unitario` to the `Pecas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Pecas_nf_id_key";

-- DropIndex
DROP INDEX "Pecas_os_id_key";

-- AlterTable
ALTER TABLE "Pecas" ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "qtd" INTEGER NOT NULL,
ADD COLUMN     "valor_total" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "valor_unitario" DECIMAL(65,30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pecas_nf_id_os_id_codigo_key" ON "Pecas"("nf_id", "os_id", "codigo");
