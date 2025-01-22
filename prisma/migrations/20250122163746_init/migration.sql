/*
  Warnings:

  - You are about to drop the column `data_registro` on the `Ck3001` table. All the data in the column will be lost.
  - You are about to alter the column `valor_total_liquido_das_pecas_na_nota_fiscal` on the `Ck3001` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `valor_total_liquido_da_peca` on the `Ck3003` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `valor_total_liquido_das_pecas_na_os` on the `Ck6011` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `valor_total_liquido_da_mao_de_obra_na_os` on the `Ck6011` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `valor_total_liquido_da_peca` on the `Ck6021` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `valor_total_liquido_da_mao_de_obra` on the `Ck6031` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `valor_total_liquido_das_pecas_na_nota_fiscal` on the `Ck7001` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `valor_total_liquido_da_mao_de_obra_na_nota_fiscal` on the `Ck7001` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `valor_total_liquido_da_peca` on the `Ck7003` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `valor_total_liquido_da_mao_de_obra` on the `Ck7004` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Ck3001" DROP COLUMN "data_registro",
ALTER COLUMN "valor_total_liquido_das_pecas_na_nota_fiscal" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_das_pecas_na_nota_fiscal" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Ck3003" ALTER COLUMN "valor_total_liquido_da_peca" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_peca" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Ck6011" ALTER COLUMN "valor_total_liquido_das_pecas_na_os" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_das_pecas_na_os" SET DATA TYPE INTEGER,
ALTER COLUMN "valor_total_liquido_da_mao_de_obra_na_os" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_mao_de_obra_na_os" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Ck6021" ALTER COLUMN "valor_total_liquido_da_peca" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_peca" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Ck6031" ALTER COLUMN "valor_total_liquido_da_mao_de_obra" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_mao_de_obra" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Ck7001" ALTER COLUMN "valor_total_liquido_das_pecas_na_nota_fiscal" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_das_pecas_na_nota_fiscal" SET DATA TYPE INTEGER,
ALTER COLUMN "valor_total_liquido_da_mao_de_obra_na_nota_fiscal" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_mao_de_obra_na_nota_fiscal" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Ck7003" ALTER COLUMN "valor_total_liquido_da_peca" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_peca" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Ck7004" ALTER COLUMN "valor_total_liquido_da_mao_de_obra" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_mao_de_obra" SET DATA TYPE INTEGER;
