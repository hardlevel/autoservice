-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_clientes_classificacao" ALTER COLUMN "id_cla_cliente" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_clientes_classificacao" ADD CONSTRAINT "tb_cad_cadastro_nfs_clientes_classificacao_id_cla_cliente_fkey" FOREIGN KEY ("id_cla_cliente") REFERENCES "tb_cki_classif_clientes"("id_cla_cliente") ON DELETE SET NULL ON UPDATE CASCADE;
