/*
  Warnings:

  - A unique constraint covering the columns `[id_nf]` on the table `tb_cad_cadastro_nfs_os_cancelamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_os]` on the table `tb_cad_cadastro_nfs_os_cancelamento` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ALTER COLUMN "id_nf" DROP NOT NULL,
ALTER COLUMN "data_emissao" DROP NOT NULL,
ALTER COLUMN "id_os" DROP NOT NULL,
ALTER COLUMN "data_abertura_os" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_os_cancelamento_id_nf_key" ON "tb_cad_cadastro_nfs_os_cancelamento"("id_nf");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_nfs_os_cancelamento_id_os_key" ON "tb_cad_cadastro_nfs_os_cancelamento"("id_os");

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_id_nf_fkey" FOREIGN KEY ("id_nf") REFERENCES "tb_cad_cadastro_nfs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_id_os_fkey" FOREIGN KEY ("id_os") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE SET NULL ON UPDATE CASCADE;
