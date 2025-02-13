/*
  Warnings:

  - You are about to drop the column `tb_cad_cadastro_nfs_id` on the `tb_cad_cadastro_nfs_clientes_fontes_pagadoras` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nota_fiscal_id,id_os,id_fonte_pagadora]` on the table `tb_cad_cadastro_nfs_clientes_fontes_pagadoras` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" DROP CONSTRAINT "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_tb_cad_cadas_fkey";

-- DropIndex
DROP INDEX "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_tb_cad_cadast_key";

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" DROP COLUMN "tb_cad_cadastro_nfs_id",
ADD COLUMN     "nota_fiscal_id" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_nota_fiscal_i_key" ON "tb_cad_cadastro_nfs_clientes_fontes_pagadoras"("nota_fiscal_id", "id_os", "id_fonte_pagadora");

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" ADD CONSTRAINT "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_nota_fiscal__fkey" FOREIGN KEY ("nota_fiscal_id") REFERENCES "tb_cad_cadastro_nfs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
