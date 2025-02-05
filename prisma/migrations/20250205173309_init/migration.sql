/*
  Warnings:

  - A unique constraint covering the columns `[chassis,id_os]` on the table `tb_cad_cadastro_os_chassis` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_os,id_fonte_pagadora]` on the table `tb_cad_cadastro_os_fontes_pagadoras` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_nf,id_os]` on the table `tb_cad_cadastro_os_nfs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_os,id_cos]` on the table `tb_cad_cadastro_os_servicos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_chassis_chassis_id_os_key" ON "tb_cad_cadastro_os_chassis"("chassis", "id_os");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_fontes_pagadoras_id_os_id_fonte_pagadora_key" ON "tb_cad_cadastro_os_fontes_pagadoras"("id_os", "id_fonte_pagadora");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_nfs_id_nf_id_os_key" ON "tb_cad_cadastro_os_nfs"("id_nf", "id_os");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_servicos_id_os_id_cos_key" ON "tb_cad_cadastro_os_servicos"("id_os", "id_cos");
