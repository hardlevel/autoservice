-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_os_id_fkey";

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ALTER COLUMN "os_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE SET NULL ON UPDATE CASCADE;
