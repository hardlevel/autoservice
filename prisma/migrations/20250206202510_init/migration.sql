-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" DROP CONSTRAINT "tb_cad_cadastro_os_fontes_pagadoras_os_id_fkey";

-- CreateTable
CREATE TABLE "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadora_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadora_B_index" ON "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras"("B");

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_nfs" ADD CONSTRAINT "tb_cad_cadastro_os_nfs_id_nf_fkey" FOREIGN KEY ("id_nf") REFERENCES "tb_cad_cadastro_nfs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_nfs" ADD CONSTRAINT "tb_cad_cadastro_os_nfs_id_fonte_pagadora_fkey" FOREIGN KEY ("id_fonte_pagadora") REFERENCES "tb_cad_cadastro_nfs_clientes_fontes_pagadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras" ADD CONSTRAINT "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras_A_fkey" FOREIGN KEY ("A") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras" ADD CONSTRAINT "_tb_cad_cadastro_osTotb_cad_cadastro_os_fontes_pagadoras_B_fkey" FOREIGN KEY ("B") REFERENCES "tb_cad_cadastro_os_fontes_pagadoras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
