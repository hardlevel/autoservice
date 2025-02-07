-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" ALTER COLUMN "id_seq_nf" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" ADD CONSTRAINT "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_id_fonte_pag_fkey" FOREIGN KEY ("id_fonte_pagadora") REFERENCES "tb_cki_fontes_pagadoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
