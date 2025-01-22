-- AlterTable
ALTER TABLE "Ck3001" ALTER COLUMN "valor_total_liquido_das_pecas_na_nota_fiscal" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_das_pecas_na_nota_fiscal" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Ck3003" ALTER COLUMN "valor_total_liquido_da_peca" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_peca" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Ck6011" ALTER COLUMN "valor_total_liquido_das_pecas_na_os" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_das_pecas_na_os" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "valor_total_liquido_da_mao_de_obra_na_os" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_mao_de_obra_na_os" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Ck6021" ALTER COLUMN "valor_total_liquido_da_peca" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_peca" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Ck6031" ALTER COLUMN "valor_total_liquido_da_mao_de_obra" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_mao_de_obra" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Ck7001" ALTER COLUMN "valor_total_liquido_das_pecas_na_nota_fiscal" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_das_pecas_na_nota_fiscal" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "valor_total_liquido_da_mao_de_obra_na_nota_fiscal" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_mao_de_obra_na_nota_fiscal" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Ck7003" ALTER COLUMN "valor_total_liquido_da_peca" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_peca" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Ck7004" ALTER COLUMN "valor_total_liquido_da_mao_de_obra" SET DEFAULT 0,
ALTER COLUMN "valor_total_liquido_da_mao_de_obra" SET DATA TYPE DECIMAL(65,30);
