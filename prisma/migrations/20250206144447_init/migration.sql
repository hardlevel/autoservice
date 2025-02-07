-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_pecas" ALTER COLUMN "valor_total_com_imposto" DROP NOT NULL,
ALTER COLUMN "desconto" DROP NOT NULL,
ALTER COLUMN "aliquota_icms" DROP NOT NULL,
ALTER COLUMN "aliquota_pis_cofins" DROP NOT NULL;
