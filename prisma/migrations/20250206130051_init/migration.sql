-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_cliente" ADD COLUMN     "tb_cad_cadastro_nfsId" INTEGER,
ALTER COLUMN "id_nf" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" ADD COLUMN     "tb_cad_cadastro_nfsId" INTEGER;

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_pecas" ADD COLUMN     "tb_cad_cadastro_nfsId" INTEGER;

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_servicos" ADD COLUMN     "tb_cad_cadastro_nfsId" INTEGER;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_cliente" ADD CONSTRAINT "tb_cad_cadastro_nfs_cliente_tb_cad_cadastro_nfsId_fkey" FOREIGN KEY ("tb_cad_cadastro_nfsId") REFERENCES "tb_cad_cadastro_nfs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" ADD CONSTRAINT "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_tb_cad_cadas_fkey" FOREIGN KEY ("tb_cad_cadastro_nfsId") REFERENCES "tb_cad_cadastro_nfs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_pecas" ADD CONSTRAINT "tb_cad_cadastro_nfs_pecas_tb_cad_cadastro_nfsId_fkey" FOREIGN KEY ("tb_cad_cadastro_nfsId") REFERENCES "tb_cad_cadastro_nfs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_servicos" ADD CONSTRAINT "tb_cad_cadastro_nfs_servicos_tb_cad_cadastro_nfsId_fkey" FOREIGN KEY ("tb_cad_cadastro_nfsId") REFERENCES "tb_cad_cadastro_nfs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
