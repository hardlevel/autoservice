-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_os_nfs" DROP CONSTRAINT "tb_cad_cadastro_os_nfs_id_fonte_pagadora_fkey";

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_nfs" ADD COLUMN     "tb_cad_cadastro_nfs_clientes_fontes_pagadorasId" BIGINT;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_nfs" ADD CONSTRAINT "tb_cad_cadastro_os_nfs_id_fonte_pagadora_fkey" FOREIGN KEY ("id_fonte_pagadora") REFERENCES "tb_cad_cadastro_os_fontes_pagadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_nfs" ADD CONSTRAINT "tb_cad_cadastro_os_nfs_tb_cad_cadastro_nfs_clientes_fontes_fkey" FOREIGN KEY ("tb_cad_cadastro_nfs_clientes_fontes_pagadorasId") REFERENCES "tb_cad_cadastro_nfs_clientes_fontes_pagadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;
