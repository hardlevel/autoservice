/*
  Warnings:

  - A unique constraint covering the columns `[nota_fiscal_id,fonte_pagadora_id]` on the table `tb_cad_cadastro_nfs_clientes_fontes_pagadoras` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_nota_fiscal_i_key";

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_nota_fiscal_i_key" ON "tb_cad_cadastro_nfs_clientes_fontes_pagadoras"("nota_fiscal_id", "fonte_pagadora_id");
