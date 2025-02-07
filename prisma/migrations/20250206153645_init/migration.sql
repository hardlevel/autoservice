-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_id_fonte_pagadora_fkey" FOREIGN KEY ("id_fonte_pagadora") REFERENCES "tb_cki_fontes_pagadoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
