/*
  Warnings:

  - A unique constraint covering the columns `[id_os]` on the table `tb_cad_cadastro_os` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_id_os_key" ON "tb_cad_cadastro_os"("id_os");

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_pecas" ADD CONSTRAINT "tb_cad_cadastro_os_pecas_id_os_fkey" FOREIGN KEY ("id_os") REFERENCES "tb_cad_cadastro_os"("id_cadastro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_clientes" ADD CONSTRAINT "tb_cad_cadastro_os_clientes_id_os_fkey" FOREIGN KEY ("id_os") REFERENCES "tb_cad_cadastro_os"("id_cadastro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" ADD CONSTRAINT "tb_cad_cadastro_os_fontes_pagadoras_id_os_fkey" FOREIGN KEY ("id_os") REFERENCES "tb_cad_cadastro_os"("id_cadastro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_chassis" ADD CONSTRAINT "tb_cad_cadastro_os_chassis_id_os_fkey" FOREIGN KEY ("id_os") REFERENCES "tb_cad_cadastro_os"("id_cadastro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_nfs" ADD CONSTRAINT "tb_cad_cadastro_os_nfs_id_os_fkey" FOREIGN KEY ("id_os") REFERENCES "tb_cad_cadastro_os"("id_cadastro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_servicos" ADD CONSTRAINT "tb_cad_cadastro_os_servicos_id_os_fkey" FOREIGN KEY ("id_os") REFERENCES "tb_cad_cadastro_os"("id_cadastro") ON DELETE RESTRICT ON UPDATE CASCADE;
