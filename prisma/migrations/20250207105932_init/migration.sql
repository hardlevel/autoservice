/*
  Warnings:

  - The primary key for the `Emails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Emails` table. All the data in the column will be lost.
  - The primary key for the `Telefones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Telefones` table. All the data in the column will be lost.
  - You are about to drop the column `id_fonte_pagadora_nf` on the `tb_cad_cadastro_nfs_os_cancelamento` table. All the data in the column will be lost.
  - You are about to drop the column `id_fonte_pagadora_os` on the `tb_cad_cadastro_nfs_os_cancelamento` table. All the data in the column will be lost.
  - You are about to drop the column `id_nf` on the `tb_cad_cadastro_nfs_os_cancelamento` table. All the data in the column will be lost.
  - You are about to drop the column `id_os` on the `tb_cad_cadastro_nfs_os_cancelamento` table. All the data in the column will be lost.
  - You are about to drop the column `id_fonte_pagadora` on the `tb_cad_cadastro_os_fontes_pagadoras` table. All the data in the column will be lost.
  - You are about to drop the `_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[os_id,fonte_pagadora_id]` on the table `tb_cad_cadastro_os_fontes_pagadoras` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `os_id` to the `tb_cad_cadastro_nfs_os_cancelamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fonte_pagadora_id` to the `tb_cad_cadastro_os_fontes_pagadoras` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras" DROP CONSTRAINT "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras_A_fkey";

-- DropForeignKey
ALTER TABLE "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras" DROP CONSTRAINT "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras_B_fkey";

-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_id_fonte_pagadora_nf_fkey";

-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_id_fonte_pagadora_os_fkey";

-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_id_nf_fkey";

-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_id_os_fkey";

-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" DROP CONSTRAINT "tb_cad_cadastro_os_fontes_pagadoras_id_fonte_pagadora_fkey";

-- DropIndex
DROP INDEX "tb_cad_cadastro_nfs_os_cancelamento_id_nf_key";

-- DropIndex
DROP INDEX "tb_cad_cadastro_nfs_os_cancelamento_id_os_key";

-- DropIndex
DROP INDEX "tb_cad_cadastro_os_fontes_pagadoras_os_id_id_fonte_pagadora_key";

-- AlterTable
ALTER TABLE "Emails" DROP CONSTRAINT "Emails_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "Telefones" DROP CONSTRAINT "Telefones_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP COLUMN "id_fonte_pagadora_nf",
DROP COLUMN "id_fonte_pagadora_os",
DROP COLUMN "id_nf",
DROP COLUMN "id_os",
ADD COLUMN     "nf_fonte_pagadora_id" INTEGER,
ADD COLUMN     "nf_id" INTEGER,
ADD COLUMN     "os_fonte_pagadora_id" INTEGER,
ADD COLUMN     "os_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" DROP COLUMN "id_fonte_pagadora",
ADD COLUMN     "fonte_pagadora_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras";

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_fontes_pagadoras_os_id_fonte_pagadora_id_key" ON "tb_cad_cadastro_os_fontes_pagadoras"("os_id", "fonte_pagadora_id");

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_nf_id_fkey" FOREIGN KEY ("nf_id") REFERENCES "tb_cad_cadastro_nfs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_nf_fonte_pagadora_id_fkey" FOREIGN KEY ("nf_fonte_pagadora_id") REFERENCES "tb_cad_cadastro_nfs_clientes_fontes_pagadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_os_fonte_pagadora_id_fkey" FOREIGN KEY ("os_fonte_pagadora_id") REFERENCES "tb_cad_cadastro_os_fontes_pagadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" ADD CONSTRAINT "tb_cad_cadastro_os_fontes_pagadoras_fonte_pagadora_id_fkey" FOREIGN KEY ("fonte_pagadora_id") REFERENCES "tb_cki_fontes_pagadoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" ADD CONSTRAINT "tb_cad_cadastro_os_fontes_pagadoras_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
