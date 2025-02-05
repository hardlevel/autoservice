/*
  Warnings:

  - The primary key for the `tb_cad_cadastro_os_pecas` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" ALTER COLUMN "total_os" DROP NOT NULL,
ALTER COLUMN "total_orcamento" DROP NOT NULL,
ALTER COLUMN "total_mo_os" DROP NOT NULL,
ALTER COLUMN "total_peca_orcamento" DROP NOT NULL,
ALTER COLUMN "total_mo_orcamento" DROP NOT NULL,
ALTER COLUMN "geral_nf" DROP NOT NULL,
ALTER COLUMN "placa" DROP NOT NULL,
ALTER COLUMN "certificacao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_pecas" DROP CONSTRAINT "tb_cad_cadastro_os_pecas_pkey",
ALTER COLUMN "id_peca" DROP NOT NULL,
ALTER COLUMN "valor_total_com_imposto" DROP NOT NULL,
ALTER COLUMN "desconto" DROP NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_os_pecas_pkey" PRIMARY KEY ("id_cadastro");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_servicos" ALTER COLUMN "valor_total" DROP NOT NULL,
ALTER COLUMN "desconto" DROP NOT NULL,
ALTER COLUMN "aliquota_iss" DROP NOT NULL;
