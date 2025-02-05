/*
  Warnings:

  - The primary key for the `tb_cad_cadastro_os` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_os` table. All the data in the column will be lost.
  - You are about to drop the column `id_os` on the `tb_cad_cadastro_os` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_os_chassis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_os_chassis` table. All the data in the column will be lost.
  - You are about to drop the column `id_os` on the `tb_cad_cadastro_os_chassis` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_os_clientes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_os_clientes` table. All the data in the column will be lost.
  - You are about to drop the column `id_os` on the `tb_cad_cadastro_os_clientes` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_os_fontes_pagadoras` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_os_fontes_pagadoras` table. All the data in the column will be lost.
  - You are about to drop the column `id_os` on the `tb_cad_cadastro_os_fontes_pagadoras` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_os_nfs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_os_nfs` table. All the data in the column will be lost.
  - You are about to drop the column `id_os` on the `tb_cad_cadastro_os_nfs` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_os_pecas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_os_pecas` table. All the data in the column will be lost.
  - You are about to drop the column `id_os` on the `tb_cad_cadastro_os_pecas` table. All the data in the column will be lost.
  - The primary key for the `tb_cad_cadastro_os_servicos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cadastro` on the `tb_cad_cadastro_os_servicos` table. All the data in the column will be lost.
  - You are about to drop the column `id_os` on the `tb_cad_cadastro_os_servicos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[os]` on the table `tb_cad_cadastro_os` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chassis,os_id]` on the table `tb_cad_cadastro_os_chassis` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[os_id,id_fonte_pagadora]` on the table `tb_cad_cadastro_os_fontes_pagadoras` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_nf,os_id]` on the table `tb_cad_cadastro_os_nfs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[os_id,id_cos]` on the table `tb_cad_cadastro_os_servicos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `os` to the `tb_cad_cadastro_os` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os_id` to the `tb_cad_cadastro_os_chassis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os_id` to the `tb_cad_cadastro_os_clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os_id` to the `tb_cad_cadastro_os_fontes_pagadoras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os_id` to the `tb_cad_cadastro_os_nfs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os_id` to the `tb_cad_cadastro_os_pecas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os_id` to the `tb_cad_cadastro_os_servicos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_os_chassis" DROP CONSTRAINT "tb_cad_cadastro_os_chassis_id_os_fkey";

-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_os_clientes" DROP CONSTRAINT "tb_cad_cadastro_os_clientes_id_os_fkey";

-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" DROP CONSTRAINT "tb_cad_cadastro_os_fontes_pagadoras_id_os_fkey";

-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_os_nfs" DROP CONSTRAINT "tb_cad_cadastro_os_nfs_id_os_fkey";

-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_os_pecas" DROP CONSTRAINT "tb_cad_cadastro_os_pecas_id_os_fkey";

-- DropForeignKey
ALTER TABLE "tb_cad_cadastro_os_servicos" DROP CONSTRAINT "tb_cad_cadastro_os_servicos_id_os_fkey";

-- DropIndex
DROP INDEX "tb_cad_cadastro_os_id_os_key";

-- DropIndex
DROP INDEX "tb_cad_cadastro_os_chassis_chassis_id_os_key";

-- DropIndex
DROP INDEX "tb_cad_cadastro_os_fontes_pagadoras_id_os_id_fonte_pagadora_key";

-- DropIndex
DROP INDEX "tb_cad_cadastro_os_nfs_id_nf_id_os_key";

-- DropIndex
DROP INDEX "tb_cad_cadastro_os_servicos_id_os_id_cos_key";

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os" DROP CONSTRAINT "tb_cad_cadastro_os_pkey",
DROP COLUMN "id_cadastro",
DROP COLUMN "id_os",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "os" TEXT NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_os_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_chassis" DROP CONSTRAINT "tb_cad_cadastro_os_chassis_pkey",
DROP COLUMN "id_cadastro",
DROP COLUMN "id_os",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "os_id" INTEGER NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_os_chassis_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_clientes" DROP CONSTRAINT "tb_cad_cadastro_os_clientes_pkey",
DROP COLUMN "id_cadastro",
DROP COLUMN "id_os",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "os_id" INTEGER NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_os_clientes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" DROP CONSTRAINT "tb_cad_cadastro_os_fontes_pagadoras_pkey",
DROP COLUMN "id_cadastro",
DROP COLUMN "id_os",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "os_id" INTEGER NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_os_fontes_pagadoras_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_nfs" DROP CONSTRAINT "tb_cad_cadastro_os_nfs_pkey",
DROP COLUMN "id_cadastro",
DROP COLUMN "id_os",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "os_id" INTEGER NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_os_nfs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_pecas" DROP CONSTRAINT "tb_cad_cadastro_os_pecas_pkey",
DROP COLUMN "id_cadastro",
DROP COLUMN "id_os",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "os_id" INTEGER NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_os_pecas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_servicos" DROP CONSTRAINT "tb_cad_cadastro_os_servicos_pkey",
DROP COLUMN "id_cadastro",
DROP COLUMN "id_os",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "os_id" INTEGER NOT NULL,
ADD CONSTRAINT "tb_cad_cadastro_os_servicos_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_os_key" ON "tb_cad_cadastro_os"("os");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_chassis_chassis_os_id_key" ON "tb_cad_cadastro_os_chassis"("chassis", "os_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_fontes_pagadoras_os_id_id_fonte_pagadora_key" ON "tb_cad_cadastro_os_fontes_pagadoras"("os_id", "id_fonte_pagadora");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_nfs_id_nf_os_id_key" ON "tb_cad_cadastro_os_nfs"("id_nf", "os_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_servicos_os_id_id_cos_key" ON "tb_cad_cadastro_os_servicos"("os_id", "id_cos");

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_pecas" ADD CONSTRAINT "tb_cad_cadastro_os_pecas_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_clientes" ADD CONSTRAINT "tb_cad_cadastro_os_clientes_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_fontes_pagadoras" ADD CONSTRAINT "tb_cad_cadastro_os_fontes_pagadoras_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_chassis" ADD CONSTRAINT "tb_cad_cadastro_os_chassis_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_nfs" ADD CONSTRAINT "tb_cad_cadastro_os_nfs_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_cad_cadastro_os_servicos" ADD CONSTRAINT "tb_cad_cadastro_os_servicos_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "tb_cad_cadastro_os"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
