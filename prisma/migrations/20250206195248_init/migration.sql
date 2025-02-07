/*
  Warnings:

  - You are about to drop the column `id_fonte_pagadora` on the `tb_cad_cadastro_nfs_os_cancelamento` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_id_fonte_pagadora_fkey";

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP COLUMN "id_fonte_pagadora",
ADD COLUMN     "id_fonte_pagadora_nf" INTEGER,
ADD COLUMN     "id_fonte_pagadora_os" INTEGER,
ADD COLUMN     "tb_cki_fontes_pagadorasId" INTEGER;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_id_fonte_pagadora_nf_fkey" FOREIGN KEY ("id_fonte_pagadora_nf") REFERENCES "tb_cad_cadastro_nfs_clientes_fontes_pagadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_id_fonte_pagadora_os_fkey" FOREIGN KEY ("id_fonte_pagadora_os") REFERENCES "tb_cad_cadastro_os_fontes_pagadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_tb_cki_fontes_pagadora_fkey" FOREIGN KEY ("tb_cki_fontes_pagadorasId") REFERENCES "tb_cki_fontes_pagadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;
