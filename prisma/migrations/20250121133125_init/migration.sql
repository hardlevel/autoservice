-- CreateTable
CREATE TABLE "Autoservice" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "receivedAt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bodyMd5" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "receipt" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Autoservice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck3001" (
    "id" SERIAL NOT NULL,
    "numero_do_dn" TEXT NOT NULL,
    "numero_da_nota_fiscal" TEXT NOT NULL,
    "serie_da_nota_fiscal" TEXT NOT NULL,
    "fonte_pagadora" INTEGER NOT NULL,
    "valor_total_liquido_das_pecas_na_nota_fiscal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "indicador" TEXT NOT NULL,
    "data_e_hora_da_emissao_da_nota_fiscal" TIMESTAMP(3) NOT NULL,
    "data_registro" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck3001_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck3002" (
    "id" SERIAL NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "ck3001_id" INTEGER NOT NULL,

    CONSTRAINT "Ck3002_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck3003" (
    "id" SERIAL NOT NULL,
    "codigo_da_peca" TEXT NOT NULL,
    "descricao_da_peca" TEXT NOT NULL,
    "quantidade_da_peca" INTEGER NOT NULL,
    "valor_total_liquido_da_peca" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "codigo_promocional" TEXT,
    "ck3001_id" INTEGER NOT NULL,

    CONSTRAINT "Ck3003_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck4001" (
    "id" SERIAL NOT NULL,
    "tipo_do_cancelamento" TEXT NOT NULL,
    "numero_do_dn" TEXT NOT NULL,
    "numero_da_nota_fiscal" TEXT,
    "numero_da_os" TEXT,
    "serie_da_nota_fiscal" TEXT,
    "data_e_hora_da_emissao_da_nota_fiscal" TIMESTAMP(3),
    "data_do_cancelamento_do_documento" TIMESTAMP(3) NOT NULL,
    "data_e_hora_da_abertura_da_os" TIMESTAMP(3),
    "data_e_hora_do_fechamento_da_os" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck4001_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck5001" (
    "id" SERIAL NOT NULL,
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
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck5001_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck6011" (
    "id" SERIAL NOT NULL,
    "numero_do_dn" TEXT NOT NULL,
    "numero_da_os" TEXT NOT NULL,
    "data_e_hora_da_abertura_da_os" TIMESTAMP(3) NOT NULL,
    "data_e_hora_do_fechamento_da_os" TIMESTAMP(3),
    "fonte_pagadora" INTEGER NOT NULL,
    "valor_total_liquido_das_pecas_na_os" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valor_total_liquido_da_mao_de_obra_na_os" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ck6011_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck6021" (
    "id" SERIAL NOT NULL,
    "codigo_da_peca" TEXT NOT NULL,
    "descricao_da_peca" TEXT NOT NULL,
    "quantidade_da_peca" INTEGER NOT NULL,
    "valor_total_liquido_da_peca" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "codigo_promocional" TEXT,
    "ck6011_id" INTEGER NOT NULL,

    CONSTRAINT "Ck6021_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck6031" (
    "id" SERIAL NOT NULL,
    "cos" TEXT NOT NULL,
    "descricao_do_servico" TEXT NOT NULL,
    "tipo_de_servico" INTEGER NOT NULL,
    "hora_vendida" DOUBLE PRECISION NOT NULL,
    "valor_total_liquido_da_mao_de_obra" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ck6011_id" INTEGER NOT NULL,

    CONSTRAINT "Ck6031_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck6041" (
    "id" SERIAL NOT NULL,
    "quilometragem_do_veiculo" INTEGER NOT NULL DEFAULT 0,
    "indicador" TEXT NOT NULL,
    "ck6011_id" INTEGER NOT NULL,

    CONSTRAINT "Ck6041_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck6042" (
    "id" SERIAL NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "ck6011_id" INTEGER NOT NULL,

    CONSTRAINT "Ck6042_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck7001" (
    "id" SERIAL NOT NULL,
    "numero_do_dn" TEXT NOT NULL,
    "numero_da_nota_fiscal" TEXT NOT NULL,
    "numero_da_os" TEXT NOT NULL,
    "serie_da_nota_fiscal" TEXT NOT NULL,
    "fonte_pagadora" INTEGER NOT NULL,
    "valor_total_liquido_das_pecas_na_nota_fiscal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valor_total_liquido_da_mao_de_obra_na_nota_fiscal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL,
    "data_e_hora_da_abertura_da_os" TIMESTAMP(3) NOT NULL,
    "data_e_hora_da_emissao_da_nota_fiscal" TIMESTAMP(3) NOT NULL,
    "data_e_hora_do_fechamento_da_os" TIMESTAMP(3),

    CONSTRAINT "Ck7001_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck7002" (
    "id" SERIAL NOT NULL,
    "ck7001_id" INTEGER NOT NULL,
    "indicador" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,

    CONSTRAINT "Ck7002_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck7003" (
    "id" SERIAL NOT NULL,
    "ck7001_id" INTEGER NOT NULL,
    "codigo_da_peca" TEXT NOT NULL,
    "descricao_da_peca" TEXT NOT NULL,
    "quantidade_da_peca" INTEGER NOT NULL,
    "valor_total_liquido_da_peca" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "codigo_promocional" TEXT,

    CONSTRAINT "Ck7003_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ck7004" (
    "id" SERIAL NOT NULL,
    "ck7001_id" INTEGER NOT NULL,
    "cos" TEXT NOT NULL,
    "descricao_do_servico" TEXT NOT NULL,
    "hora_vendida" DOUBLE PRECISION NOT NULL,
    "valor_total_liquido_da_mao_de_obra" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tipo_de_servico" INTEGER,

    CONSTRAINT "Ck7004_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_os_pecas" (
    "id_cadastro" INTEGER NOT NULL,
    "id_os" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "id_fonte_pagadora" INTEGER NOT NULL,
    "id_seq_peca" INTEGER,
    "qtd" INTEGER NOT NULL,
    "id_peca" INTEGER NOT NULL,
    "valor_unitario" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valor_total_com_imposto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "desconto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valor_total_liquido" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "tb_cad_cadastro_os_pecas_pkey" PRIMARY KEY ("id_peca")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_os_clientes" (
    "id_cadastro" INTEGER NOT NULL,
    "id_os" INTEGER NOT NULL,
    "id_fonte_pagadora" INTEGER NOT NULL,
    "nome" TEXT,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "indicador" TEXT NOT NULL,
    "tel_res" TEXT,
    "tel_com" TEXT,
    "tel_cel" TEXT,
    "email" TEXT NOT NULL,

    CONSTRAINT "tb_cad_cadastro_os_clientes_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_os_fontes_pagadoras" (
    "id_cadastro" INTEGER NOT NULL,
    "id_os" INTEGER NOT NULL,
    "id_fonte_pagadora" INTEGER NOT NULL,
    "data_abertura_os" TIMESTAMP(3) NOT NULL,
    "data_fechamento_os" TIMESTAMP(3),
    "total_os" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_orcamento" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_mo_os" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_peca_orcamento" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_mo_orcamento" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "geral_nf" TEXT NOT NULL,
    "nr_orcamento" TEXT NOT NULL,
    "data_orcamento" TIMESTAMP(3) NOT NULL,
    "chassis" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "certificacao" TEXT NOT NULL,
    "km" INTEGER NOT NULL,

    CONSTRAINT "tb_cad_cadastro_os_fontes_pagadoras_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_os_chassis" (
    "id_cadastro" INTEGER NOT NULL,
    "chassis" TEXT NOT NULL,
    "id_os" INTEGER NOT NULL,

    CONSTRAINT "tb_cad_cadastro_os_chassis_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_os" (
    "id_cadastro" INTEGER NOT NULL,
    "id_os" INTEGER NOT NULL,
    "id_status_os" INTEGER,

    CONSTRAINT "tb_cad_cadastro_os_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_os_nfs" (
    "id_cadastro" INTEGER NOT NULL,
    "id_nf" INTEGER NOT NULL,
    "serie_nf" TEXT NOT NULL,
    "id_os" INTEGER NOT NULL,
    "id_fonte_pagadora" INTEGER,
    "id_seq_nf" INTEGER,

    CONSTRAINT "tb_cad_cadastro_os_nfs_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_os_servicos" (
    "id_cadastro" INTEGER NOT NULL,
    "id_os" INTEGER NOT NULL,
    "id_seq_servico" INTEGER,
    "id_fonte_pagadora" INTEGER,
    "id_cos" INTEGER NOT NULL,
    "desc_cos" TEXT NOT NULL,
    "hora_vendida" DOUBLE PRECISION NOT NULL,
    "valor_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "desconto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valor_total_liquido" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "aliquota_iss" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "id_tipo_servico" INTEGER NOT NULL,

    CONSTRAINT "tb_cad_cadastro_os_servicos_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_nfs_os_cancelamento" (
    "id_seq" INTEGER NOT NULL,
    "tipo_cancelamento" TEXT NOT NULL,
    "id_cadastro" INTEGER NOT NULL,
    "id_nf" INTEGER NOT NULL,
    "serie_nf" TEXT NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL,
    "id_os" INTEGER NOT NULL,
    "data_abertura_os" TIMESTAMP(3) NOT NULL,
    "id_fonte_pagadora" INTEGER NOT NULL,
    "data_cancelamento" TIMESTAMP(3) NOT NULL,
    "id_lote" INTEGER,
    "id_linha" INTEGER,
    "data_emissao_ok" TIMESTAMP(3),
    "data_abertura_os_ok" TIMESTAMP(3),
    "data_cancelamento_ok" TIMESTAMP(3),
    "numero_dn" INTEGER NOT NULL,
    "numero_nf" INTEGER,
    "numero_os" INTEGER,
    "id_status" INTEGER,

    CONSTRAINT "tb_cad_cadastro_nfs_os_cancelamento_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_nfs_clientes_classificacao" (
    "id_cadastro" INTEGER NOT NULL,
    "id_nf" INTEGER NOT NULL,
    "serie_nf" TEXT NOT NULL,
    "id_cla_cliente" INTEGER NOT NULL,
    "id_seq_nf" INTEGER NOT NULL,

    CONSTRAINT "tb_cad_cadastro_nfs_clientes_classificacao_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_nfs_cliente" (
    "id_cadastro" INTEGER NOT NULL,
    "id_nf" INTEGER NOT NULL,
    "serie_nf" TEXT NOT NULL,
    "nome" TEXT,
    "id_seq_nf" INTEGER,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "indicador" TEXT,
    "tel_res" TEXT,
    "tel_com" TEXT,
    "tel_cel" TEXT,
    "email" TEXT NOT NULL,

    CONSTRAINT "tb_cad_cadastro_nfs_cliente_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_nfs" (
    "id_cadastro" INTEGER NOT NULL,
    "id_nf" INTEGER NOT NULL,
    "serie_nf" TEXT NOT NULL,
    "id_status_nf" INTEGER,
    "id_seq_nf" INTEGER,
    "data_emissao" TIMESTAMP(3) NOT NULL,
    "valor_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "desconto_geral_pecas" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valor_total_mo" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "desconto_geral_mo" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "servico_veiculo_novo" TEXT,
    "data_emissao_os" TIMESTAMP(3),
    "id_lote" INTEGER,
    "id_os" INTEGER,
    "id_fonte_pagadora" INTEGER,
    "id_tipo_nf" INTEGER,

    CONSTRAINT "tb_cad_cadastro_nfs_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" (
    "id_cadastro" INTEGER NOT NULL,
    "id_nf" INTEGER NOT NULL,
    "serie_nf" TEXT NOT NULL,
    "id_fonte_pagadora" INTEGER NOT NULL,
    "id_seq_nf" INTEGER NOT NULL,
    "id_os" INTEGER NOT NULL,

    CONSTRAINT "tb_cad_cadastro_nfs_clientes_fontes_pagadoras_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_nfs_pecas" (
    "id_cadastro" INTEGER NOT NULL,
    "id_nf" INTEGER NOT NULL,
    "serie_nf" TEXT NOT NULL,
    "id_seq" INTEGER,
    "id_peca" INTEGER NOT NULL,
    "id_seq_nf" INTEGER,
    "descricao" TEXT NOT NULL,
    "qtd" INTEGER NOT NULL,
    "valor_unitario" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valor_total_com_imposto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "desconto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valor_total_liquido" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "aliquota_icms" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "aliquota_pis_cofins" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "tb_cad_cadastro_nfs_pecas_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateTable
CREATE TABLE "tb_cad_cadastro_nfs_servicos" (
    "id_cadastro" INTEGER NOT NULL,
    "id_nf" INTEGER NOT NULL,
    "serie_nf" TEXT NOT NULL,
    "id_seq_nf" INTEGER,
    "hora_vendida" DOUBLE PRECISION NOT NULL,
    "id_seq_servico" INTEGER,
    "id_cos" INTEGER NOT NULL,
    "valor_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "desconto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "des_cos" TEXT NOT NULL,
    "valor_total_liquido" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "aliquota_iss" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "aliquota_pis_cofins" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "tb_cad_cadastro_nfs_servicos_pkey" PRIMARY KEY ("id_cadastro")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ck3001_numero_da_nota_fiscal_key" ON "Ck3001"("numero_da_nota_fiscal");

-- CreateIndex
CREATE UNIQUE INDEX "Ck4001_numero_da_nota_fiscal_key" ON "Ck4001"("numero_da_nota_fiscal");

-- CreateIndex
CREATE UNIQUE INDEX "Ck4001_numero_da_os_key" ON "Ck4001"("numero_da_os");

-- CreateIndex
CREATE UNIQUE INDEX "Ck5001_numero_do_dn_key" ON "Ck5001"("numero_do_dn");

-- CreateIndex
CREATE UNIQUE INDEX "Ck6011_numero_da_os_key" ON "Ck6011"("numero_da_os");

-- CreateIndex
CREATE UNIQUE INDEX "Ck7001_numero_da_nota_fiscal_key" ON "Ck7001"("numero_da_nota_fiscal");

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
ALTER TABLE "Ck6042" ADD CONSTRAINT "Ck6042_ck6011_id_fkey" FOREIGN KEY ("ck6011_id") REFERENCES "Ck6011"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck7002" ADD CONSTRAINT "Ck7002_ck7001_id_fkey" FOREIGN KEY ("ck7001_id") REFERENCES "Ck7001"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck7003" ADD CONSTRAINT "Ck7003_ck7001_id_fkey" FOREIGN KEY ("ck7001_id") REFERENCES "Ck7001"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ck7004" ADD CONSTRAINT "Ck7004_ck7001_id_fkey" FOREIGN KEY ("ck7001_id") REFERENCES "Ck7001"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
