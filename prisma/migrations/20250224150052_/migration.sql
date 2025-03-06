-- CreateTable
CREATE TABLE "Ck3001" (
    "id" BIGSERIAL NOT NULL,
    "numero_do_dn" TEXT NOT NULL,
    "numero_da_nota_fiscal" TEXT NOT NULL,
    "serie_da_nota_fiscal" TEXT,
    "fonte_pagadora" INTEGER NOT NULL,
    "valor_total_liquido_das_pecas_na_nota_fiscal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "indicador" TEXT NOT NULL,
    "data_e_hora_da_emissao_da_nota_fiscal" TIMESTAMP(3) NOT NULL,
    "numero" TEXT,
    "endereco" TEXT NOT NULL,
    "complemento" TEXT,
    "nome_do_cliente" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck3001_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck3002" (
    "id" BIGSERIAL NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT,
    "uf" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "ck3001_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck3002_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck3003" (
    "id" BIGSERIAL NOT NULL,
    "codigo_da_peca" TEXT NOT NULL,
    "descricao_da_peca" TEXT,
    "quantidade_da_peca" INTEGER NOT NULL,
    "valor_total_liquido_da_peca" DECIMAL(10,2) DEFAULT 0,
    "codigo_promocional" TEXT,
    "ck3001_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck3003_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck4001" (
    "id" BIGSERIAL NOT NULL,
    "tipo_do_cancelamento" TEXT NOT NULL,
    "numero_do_dn" TEXT NOT NULL,
    "numero_da_nota_fiscal" TEXT,
    "numero_da_os" TEXT,
    "serie_da_nota_fiscal" TEXT,
    "data_e_hora_da_emissao_da_nota_fiscal" TIMESTAMP(3),
    "data_do_cancelamento_do_documento" TIMESTAMP(3) NOT NULL,
    "data_e_hora_da_abertura_da_os" TIMESTAMP(3),
    "data_e_hora_do_fechamento_da_os" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck4001_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck5001" (
    "id" BIGSERIAL NOT NULL,
    "numero_do_dn" TEXT NOT NULL,
    "tempo_remunerado" DOUBLE PRECISION,
    "tempo_disponivel_servicos_gerais_produtivos" DOUBLE PRECISION,
    "tempo_disponivel_servicos_rapido_produtivos" DOUBLE PRECISION,
    "tempo_disponivel_servicos_carroceria_produtivos_funileiros" DOUBLE PRECISION,
    "tempo_disponivel_servicos_carroceria_produtivos_pintores" DOUBLE PRECISION,
    "taxa_de_mao_de_obra_publico" DOUBLE PRECISION,
    "servicos_gerente" INTEGER,
    "servicos_chefe_de_oficina" INTEGER,
    "servicos_consultor_tecnico" INTEGER,
    "servicos_aprendiz" INTEGER,
    "servicos_suporte" INTEGER,
    "servicos_gerais_produtivos" INTEGER,
    "servicos_rapido_produtivos" INTEGER,
    "servicos_carroceria_produtivos_funileiros" INTEGER,
    "servicos_carroceria_produtivos_pintores" INTEGER,
    "servicos_lavadores_lubrificadores" INTEGER,
    "servicos_terceiros" INTEGER,
    "pecas_gerente" INTEGER,
    "pecas_suporte" INTEGER,
    "pecas_balconista_varejo" INTEGER,
    "pecas_balconista_oficina" INTEGER,
    "pecas_vendedor_atacado" INTEGER,
    "pecas_vendedor_acessorios" INTEGER,
    "locais_de_trabalho_servicos_gerais" INTEGER,
    "locais_de_trabalho_servico_rapido" INTEGER,
    "locais_de_trabalho_servicos_de_funilaria" INTEGER,
    "locais_de_trabalho_servicos_de_pintura" INTEGER,
    "locais_de_trabalho_lavagem_e_lubrificacao" INTEGER,
    "locais_de_trabalho_utilizados_por_terceiros" INTEGER,
    "mes_e_ano_de_referencia" TEXT,
    "ano_de_referencia" INTEGER NOT NULL,
    "mes_de_referencia" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck5001_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck6011" (
    "id" BIGSERIAL NOT NULL,
    "numero_do_dn" TEXT NOT NULL,
    "numero_da_os" TEXT NOT NULL,
    "data_e_hora_da_abertura_da_os" TIMESTAMP(3) NOT NULL,
    "data_e_hora_do_fechamento_da_os" TIMESTAMP(3),
    "fonte_pagadora" INTEGER NOT NULL,
    "valor_total_liquido_das_pecas_na_os" DECIMAL(10,2) DEFAULT 0,
    "valor_total_liquido_da_mao_de_obra_na_os" DECIMAL(10,2) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck6011_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck6021" (
    "id" BIGSERIAL NOT NULL,
    "codigo_da_peca" TEXT NOT NULL,
    "descricao_da_peca" TEXT,
    "quantidade_da_peca" INTEGER NOT NULL,
    "valor_total_liquido_da_peca" DECIMAL(10,2) DEFAULT 0,
    "codigo_promocional" TEXT,
    "ck6011_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck6021_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck6031" (
    "id" BIGSERIAL NOT NULL,
    "cos" TEXT,
    "descricao_do_servico" TEXT,
    "tipo_de_servico" INTEGER,
    "hora_vendida" DOUBLE PRECISION,
    "valor_total_liquido_da_mao_de_obra" DECIMAL(10,2) DEFAULT 0,
    "ck6011_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck6031_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck6041" (
    "id" BIGSERIAL NOT NULL,
    "quilometragem_do_veiculo" INTEGER DEFAULT 0,
    "indicador" TEXT NOT NULL,
    "chassi_do_veiculo" TEXT,
    "placa_do_veiculo" TEXT,
    "nome_do_cliente" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "ck6011_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck6041_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck6042" (
    "id" BIGSERIAL NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "ck6041_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck6042_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck7001" (
    "id" BIGSERIAL NOT NULL,
    "nome_do_cliente" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero_do_dn" TEXT NOT NULL,
    "numero_da_nota_fiscal" TEXT NOT NULL,
    "numero_da_os" TEXT NOT NULL,
    "serie_da_nota_fiscal" TEXT,
    "fonte_pagadora" INTEGER NOT NULL,
    "valor_total_liquido_das_pecas_na_nota_fiscal" DECIMAL(10,2) DEFAULT 0,
    "valor_total_liquido_da_mao_de_obra_na_nota_fiscal" DECIMAL(10,2) DEFAULT 0,
    "data_e_hora_da_abertura_da_os" TIMESTAMP(3) NOT NULL,
    "data_e_hora_da_emissao_da_nota_fiscal" TIMESTAMP(3) NOT NULL,
    "data_e_hora_do_fechamento_da_os" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck7001_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck7002" (
    "id" BIGSERIAL NOT NULL,
    "ck7001_id" BIGINT NOT NULL,
    "indicador" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "bairro" TEXT,
    "numero" TEXT DEFAULT 'Não informado',
    "complemento" TEXT,
    "cpf_cnpj" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck7002_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck7003" (
    "id" BIGSERIAL NOT NULL,
    "ck7001_id" BIGINT NOT NULL,
    "codigo_da_peca" TEXT NOT NULL,
    "descricao_da_peca" TEXT,
    "quantidade_da_peca" INTEGER NOT NULL,
    "valor_total_liquido_da_peca" DECIMAL(10,2) DEFAULT 0,
    "codigo_promocional" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck7003_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck7004" (
    "id" BIGSERIAL NOT NULL,
    "ck7001_id" BIGINT NOT NULL,
    "cos" TEXT,
    "descricao_do_servico" TEXT NOT NULL,
    "hora_vendida" DOUBLE PRECISION,
    "valor_total_liquido_da_mao_de_obra" DECIMAL(10,2) DEFAULT 0,
    "tipo_de_servico" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck7004_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emails" (
    "email" TEXT NOT NULL,
    "descricao" TEXT NOT NULL DEFAULT 'pessoal',
    "autoriza_contato" BOOLEAN NOT NULL,
    "autoriza_pesquisa" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "ck3002_id" BIGINT,
    "ck6042_id" BIGINT,
    "ck7002_id" BIGINT
);

-- CreateTable
CREATE TABLE "ErrorLogger" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,
    "message" TEXT,
    "code" TEXT,
    "params" TEXT,
    "originalData" TEXT,

    CONSTRAINT "ErrorLogger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CkLogs" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "data" TEXT,
    "qtd" INTEGER,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "jobId" BIGINT NOT NULL,

    CONSTRAINT "CkLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobLogs" (
    "id" BIGSERIAL NOT NULL,
    "jobId" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "startDate" TEXT,
    "endDate" TEXT,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "data" TEXT,

    CONSTRAINT "JobLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCk" (
    "id" BIGSERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "ck3001" INTEGER,
    "ck3002" INTEGER,
    "ck3003" INTEGER,
    "ck4001" INTEGER,
    "ck5001" INTEGER,
    "ck6011" INTEGER,
    "ck6021" INTEGER,
    "ck6031" INTEGER,
    "ck6041" INTEGER,
    "ck6042" INTEGER,
    "ck7001" INTEGER,
    "ck7002" INTEGER,
    "ck7003" INTEGER,
    "ck7004" INTEGER,

    CONSTRAINT "DailyCk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telefones" (
    "ck3002_id" BIGINT,
    "ck6042_id" BIGINT,
    "ck7002_id" BIGINT,
    "numero" TEXT NOT NULL,
    "descricao" TEXT NOT NULL DEFAULT 'residencial',
    "autoriza_contato" BOOLEAN NOT NULL,
    "autoriza_pesquisa" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "Ck3001_numero_da_nota_fiscal_idx" ON "Ck3001" USING HASH ("numero_da_nota_fiscal");

-- CreateIndex
CREATE UNIQUE INDEX "Ck3001_cpf_cnpj_numero_da_nota_fiscal_key" ON "Ck3001"("cpf_cnpj", "numero_da_nota_fiscal");

-- CreateIndex
CREATE UNIQUE INDEX "Ck3002_cidade_bairro_uf_cep_ck3001_id_key" ON "Ck3002"("cidade", "bairro", "uf", "cep", "ck3001_id");

-- CreateIndex
CREATE INDEX "Ck3003_codigo_da_peca_idx" ON "Ck3003" USING HASH ("codigo_da_peca");

-- CreateIndex
CREATE UNIQUE INDEX "Ck3003_codigo_da_peca_ck3001_id_key" ON "Ck3003"("codigo_da_peca", "ck3001_id");

-- CreateIndex
CREATE INDEX "Ck4001_numero_da_nota_fiscal_idx" ON "Ck4001" USING HASH ("numero_da_nota_fiscal");

-- CreateIndex
CREATE UNIQUE INDEX "Ck4001_numero_do_dn_data_do_cancelamento_do_documento_key" ON "Ck4001"("numero_do_dn", "data_do_cancelamento_do_documento");

-- CreateIndex
CREATE INDEX "Ck5001_numero_do_dn_idx" ON "Ck5001" USING HASH ("numero_do_dn");

-- CreateIndex
CREATE UNIQUE INDEX "Ck5001_numero_do_dn_ano_de_referencia_mes_de_referencia_key" ON "Ck5001"("numero_do_dn", "ano_de_referencia", "mes_de_referencia");

-- CreateIndex
CREATE INDEX "Ck6011_numero_da_os_idx" ON "Ck6011" USING HASH ("numero_da_os");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6011_numero_da_os_numero_do_dn_key" ON "Ck6011"("numero_da_os", "numero_do_dn");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6021_codigo_da_peca_ck6011_id_key" ON "Ck6021"("codigo_da_peca", "ck6011_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6031_cos_ck6011_id_key" ON "Ck6031"("cos", "ck6011_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6041_nome_do_cliente_chassi_do_veiculo_ck6011_id_key" ON "Ck6041"("nome_do_cliente", "chassi_do_veiculo", "ck6011_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6042_cidade_uf_cep_ck6041_id_key" ON "Ck6042"("cidade", "uf", "cep", "ck6041_id");

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

-- CreateIndex
CREATE UNIQUE INDEX "Emails_email_key" ON "Emails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCk_day_month_year_key" ON "DailyCk"("day", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Telefones_numero_key" ON "Telefones"("numero");

-- AddForeignKey
ALTER TABLE "Ck3002" ADD CONSTRAINT "Ck3002_ck3001_id_fkey" FOREIGN KEY ("ck3001_id") REFERENCES "Ck3001"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck3003" ADD CONSTRAINT "Ck3003_ck3001_id_fkey" FOREIGN KEY ("ck3001_id") REFERENCES "Ck3001"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck6021" ADD CONSTRAINT "Ck6021_ck6011_id_fkey" FOREIGN KEY ("ck6011_id") REFERENCES "Ck6011"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck6031" ADD CONSTRAINT "Ck6031_ck6011_id_fkey" FOREIGN KEY ("ck6011_id") REFERENCES "Ck6011"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck6041" ADD CONSTRAINT "Ck6041_ck6011_id_fkey" FOREIGN KEY ("ck6011_id") REFERENCES "Ck6011"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck6042" ADD CONSTRAINT "Ck6042_ck6041_id_fkey" FOREIGN KEY ("ck6041_id") REFERENCES "Ck6041"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck7002" ADD CONSTRAINT "Ck7002_ck7001_id_fkey" FOREIGN KEY ("ck7001_id") REFERENCES "Ck7001"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck7003" ADD CONSTRAINT "Ck7003_ck7001_id_fkey" FOREIGN KEY ("ck7001_id") REFERENCES "Ck7001"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck7004" ADD CONSTRAINT "Ck7004_ck7001_id_fkey" FOREIGN KEY ("ck7001_id") REFERENCES "Ck7001"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_ck3002_id_fkey" FOREIGN KEY ("ck3002_id") REFERENCES "Ck3002"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_ck6042_id_fkey" FOREIGN KEY ("ck6042_id") REFERENCES "Ck6042"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_ck7002_id_fkey" FOREIGN KEY ("ck7002_id") REFERENCES "Ck7002"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefones" ADD CONSTRAINT "Telefones_ck3002_id_fkey" FOREIGN KEY ("ck3002_id") REFERENCES "Ck3002"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefones" ADD CONSTRAINT "Telefones_ck6042_id_fkey" FOREIGN KEY ("ck6042_id") REFERENCES "Ck6042"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefones" ADD CONSTRAINT "Telefones_ck7002_id_fkey" FOREIGN KEY ("ck7002_id") REFERENCES "Ck7002"("id") ON DELETE CASCADE ON UPDATE CASCADE;
