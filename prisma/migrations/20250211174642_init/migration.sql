/*
  Warnings:

  - A unique constraint covering the columns `[id_cla_cliente]` on the table `tb_cki_classif_clientes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tb_cki_classif_clientes" ALTER COLUMN "id_cla_cliente" DROP DEFAULT;
DROP SEQUENCE "tb_cki_classif_clientes_id_cla_cliente_seq";

-- CreateIndex
CREATE UNIQUE INDEX "tb_cki_classif_clientes_id_cla_cliente_key" ON "tb_cki_classif_clientes"("id_cla_cliente");
