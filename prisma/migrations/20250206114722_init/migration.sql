/*
  Warnings:

  - The primary key for the `tb_cad_cadastro_nfs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_nfs` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_nfs_cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_nfs_cliente` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_nfs_clientes_classificacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_nfs_clientes_classificacao` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_nfs_clientes_fontes_pagadoras` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_nfs_clientes_fontes_pagadoras` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_nfs_os_cancelamento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_nfs_os_cancelamento` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_nfs_pecas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_nfs_pecas` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_nfs_servicos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_nfs_servicos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs" DROP CONSTRAINT "tb_cad_cadastro_nfs_pkey",
DROP COLUMN "id_cadastro",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "desconto_geral_pecas" DROP NOT NULL,
ALTER COLUMN "desconto_geral_mo" DROP NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_nfs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_cliente" DROP CONSTRAINT "tb_cad_cadastro_nfs_cliente_pkey",
DROP COLUMN "id_cadastro",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_nfs_cliente_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_clientes_classificacao" DROP CONSTRAINT "tb_cad_cadastro_nfs_clientes_classificacao_pkey",
DROP COLUMN "id_cadastro",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_nfs_clientes_classificacao_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" DROP CONSTRAINT "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_pkey",
DROP COLUMN "id_cadastro",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_os_cancelamento" DROP CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_pkey",
DROP COLUMN "id_cadastro",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_pecas" DROP CONSTRAINT "tb_cad_cadastro_nfs_pecas_pkey",
DROP COLUMN "id_cadastro",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_nfs_pecas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_nfs_servicos" DROP CONSTRAINT "tb_cad_cadastro_nfs_servicos_pkey",
DROP COLUMN "id_cadastro",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_nfs_servicos_pkey" PRIMARY KEY ("id");
