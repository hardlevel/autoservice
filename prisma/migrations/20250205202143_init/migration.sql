/*
  Warnings:

  - You are about to drop the column `geral_nf` on the `tb_cad_cadastro_os_fontes_pagadoras` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" DROP COLUMN "geral_nf",
ADD COLUMN     "gera_nf" TEXT,
ADD COLUMN     "total_peca_os" DECIMAL(65,30) DEFAULT 0;
