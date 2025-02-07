/*
  Warnings:

  - A unique constraint covering the columns `[tb_cad_cadastro_nfsId,id_os,id_fonte_pagadora]` on the table `tb_cad_cadastro_nfs_clientes_fontes_pagadoras` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_tb_cad_cadast_key" ON "tb_cad_cadastro_nfs_clientes_fontes_pagadoras"("tb_cad_cadastro_nfsId", "id_os", "id_fonte_pagadora");
