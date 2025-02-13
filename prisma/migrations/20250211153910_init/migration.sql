/*
  Warnings:

  - You are about to drop the column `id_fonte_pagadora` on the `tb_cad_cadastro_nfs_clientes_fontes_pagadoras` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nota_fiscal_id,id_os,fonte_pagadora_id]` on the table `tb_cad_cadastro_nfs_clientes_fontes_pagadoras` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" DROP CONSTRAINT "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_id_fonte_pag_fkey";

-- DropIndex
DROP INDEX "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_nota_fiscal_i_key";

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" DROP COLUMN "id_fonte_pagadora",
ADD COLUMN     "fonte_pagadora_id" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_nota_fiscal_i_key" ON "tb_cad_cadastro_nfs_clientes_fontes_pagadoras"("nota_fiscal_id", "id_os", "fonte_pagadora_id");

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" ADD CONSTRAINT "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_fonte_pagado_fkey" FOREIGN KEY ("fonte_pagadora_id") REFERENCES "tb_cki_fontes_pagadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;
