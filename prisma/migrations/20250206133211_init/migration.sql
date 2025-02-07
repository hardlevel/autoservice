/*
  Warnings:

  - You are about to drop the column `desc_cos` on the `tb_cad_cadastro_os_servicos` table. All the data in the column will be lost.
  - You are about to drop the column `hora_vendida` on the `tb_cad_cadastro_os_servicos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_servicos" DROP COLUMN "desc_cos",
DROP COLUMN "hora_vendida";

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs" ADD CONSTRAINT "tb_cad_cadastro_nfs_id_os_fkey" FOREIGN KEY ("id_os") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE SET NULL ON UPDATE CASCADE;
