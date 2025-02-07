-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs" ADD COLUMN     "valor_total_pecas" DECIMAL(65,30) DEFAULT 0;

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_servicos" ALTER COLUMN "valor_total" DROP NOT NULL,
ALTER COLUMN "desconto" DROP NOT NULL,
ALTER COLUMN "valor_total_liquido" DROP NOT NULL,
ALTER COLUMN "aliquota_iss" DROP NOT NULL,
ALTER COLUMN "aliquota_pis_cofins" DROP NOT NULL;
