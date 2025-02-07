/*
  Warnings:

  - You are about to drop the column `tb_cki_fontes_pagadorasId` on the `tb_cad_cadastro_nfs_os_cancelamento` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_tb_cki_fontes_pagadora_fkey";

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP COLUMN "tb_cki_fontes_pagadorasId";
