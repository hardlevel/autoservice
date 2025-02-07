-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" ALTER COLUMN "id_nf" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_pecas" ALTER COLUMN "id_nf" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_servicos" ALTER COLUMN "id_nf" DROP NOT NULL;
