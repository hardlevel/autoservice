/*
  Warnings:

  - A unique constraint covering the columns `[numero_da_os,numero_do_dn]` on the table `Ck6011` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo_da_peca,ck6011_id]` on the table `Ck6021` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cos,ck6011_id]` on the table `Ck6031` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chassi_do_veiculo,placa_do_veiculo,ck6011_id]` on the table `Ck6041` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cidade,uf,ck6011_id]` on the table `Ck6042` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero_da_nota_fiscal,numero_do_dn]` on the table `Ck7001` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cidade,uf,indicador,ck7001_id]` on the table `Ck7002` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ck7001_id,codigo_da_peca]` on the table `Ck7003` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ck7001_id,cos]` on the table `Ck7004` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bairro` to the `Ck6041` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chassi_do_veiculo` to the `Ck6041` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf_cnpj` to the `Ck6041` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Ck6041` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_do_cliente` to the `Ck6041` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Ck6041` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placa_do_veiculo` to the `Ck6041` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ck3001" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ck3002" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ck3003" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ck4001" ADD COLUMN     "modified_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ck5001" ADD COLUMN     "modified_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ck6011" ADD COLUMN     "modified_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ck6021" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ck6031" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ck6041" ADD COLUMN     "bairro" TEXT NOT NULL,
ADD COLUMN     "chassi_do_veiculo" TEXT NOT NULL,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "cpf_cnpj" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "modified_at" TIMESTAMP(3),
ADD COLUMN     "nome_do_cliente" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "placa_do_veiculo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ck6042" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ck7001" ADD COLUMN     "modified_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ck7002" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ck7003" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ck7004" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Emails" ADD COLUMN     "ck6042_id" INTEGER,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3),
ALTER COLUMN "ck3002_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Telefones" ADD COLUMN     "ck6042_id" INTEGER,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3),
ALTER COLUMN "ck3002_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Ck3001_numero_da_nota_fiscal_idx" ON "Ck3001" USING HASH ("numero_da_nota_fiscal");

-- CreateIndex
CREATE INDEX "Ck3003_codigo_da_peca_idx" ON "Ck3003" USING HASH ("codigo_da_peca");

-- CreateIndex
CREATE INDEX "Ck4001_numero_da_nota_fiscal_idx" ON "Ck4001" USING HASH ("numero_da_nota_fiscal");

-- CreateIndex
CREATE INDEX "Ck5001_numero_do_dn_idx" ON "Ck5001" USING HASH ("numero_do_dn");

-- CreateIndex
CREATE INDEX "Ck6011_numero_da_os_idx" ON "Ck6011" USING HASH ("numero_da_os");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6011_numero_da_os_numero_do_dn_key" ON "Ck6011"("numero_da_os", "numero_do_dn");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6021_codigo_da_peca_ck6011_id_key" ON "Ck6021"("codigo_da_peca", "ck6011_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6031_cos_ck6011_id_key" ON "Ck6031"("cos", "ck6011_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6041_chassi_do_veiculo_placa_do_veiculo_ck6011_id_key" ON "Ck6041"("chassi_do_veiculo", "placa_do_veiculo", "ck6011_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6042_cidade_uf_ck6011_id_key" ON "Ck6042"("cidade", "uf", "ck6011_id");

-- CreateIndex
CREATE INDEX "Ck7001_numero_da_nota_fiscal_idx" ON "Ck7001" USING HASH ("numero_da_nota_fiscal");

-- CreateIndex
CREATE UNIQUE INDEX "Ck7001_numero_da_nota_fiscal_numero_do_dn_key" ON "Ck7001"("numero_da_nota_fiscal", "numero_do_dn");

-- CreateIndex
CREATE UNIQUE INDEX "Ck7002_cidade_uf_indicador_ck7001_id_key" ON "Ck7002"("cidade", "uf", "indicador", "ck7001_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ck7003_ck7001_id_codigo_da_peca_key" ON "Ck7003"("ck7001_id", "codigo_da_peca");

-- CreateIndex
CREATE UNIQUE INDEX "Ck7004_ck7001_id_cos_key" ON "Ck7004"("ck7001_id", "cos");

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_ck6042_id_fkey" FOREIGN KEY ("ck6042_id") REFERENCES "Ck6042"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefones" ADD CONSTRAINT "Telefones_ck6042_id_fkey" FOREIGN KEY ("ck6042_id") REFERENCES "Ck6042"("id") ON DELETE CASCADE ON UPDATE CASCADE;
