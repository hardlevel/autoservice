/*
  Warnings:

  - A unique constraint covering the columns `[nome,cpf_cnpj]` on the table `tb_cad_cadastro_os_clientes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `tb_cki_fontes_pagadoras` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE tb_cad_cadastro_nfs_id_cadastro_seq;
ALTER TABLE "tb_cad_cadastro_nfs" ALTER COLUMN "id_cadastro" SET DEFAULT nextval('tb_cad_cadastro_nfs_id_cadastro_seq');
ALTER SEQUENCE tb_cad_cadastro_nfs_id_cadastro_seq OWNED BY "tb_cad_cadastro_nfs"."id_cadastro";

-- AlterTable
CREATE SEQUENCE tb_cad_cadastro_nfs_cliente_id_cadastro_seq;
ALTER TABLE "tb_cad_cadastro_nfs_cliente" ALTER COLUMN "id_cadastro" SET DEFAULT nextval('tb_cad_cadastro_nfs_cliente_id_cadastro_seq');
ALTER SEQUENCE tb_cad_cadastro_nfs_cliente_id_cadastro_seq OWNED BY "tb_cad_cadastro_nfs_cliente"."id_cadastro";

-- AlterTable
CREATE SEQUENCE tb_cad_cadastro_nfs_clientes_classificacao_id_cadastro_seq;
ALTER TABLE "tb_cad_cadastro_nfs_clientes_classificacao" ALTER COLUMN "id_cadastro" SET DEFAULT nextval('tb_cad_cadastro_nfs_clientes_classificacao_id_cadastro_seq');
ALTER SEQUENCE tb_cad_cadastro_nfs_clientes_classificacao_id_cadastro_seq OWNED BY "tb_cad_cadastro_nfs_clientes_classificacao"."id_cadastro";

-- AlterTable
CREATE SEQUENCE tb_cad_cadastro_nfs_clientes_fontes_pagadoras_id_cadastro_seq;
ALTER TABLE "tb_cad_cadastro_nfs_clientes_fontes_pagadoras" ALTER COLUMN "id_cadastro" SET DEFAULT nextval('tb_cad_cadastro_nfs_clientes_fontes_pagadoras_id_cadastro_seq');
ALTER SEQUENCE tb_cad_cadastro_nfs_clientes_fontes_pagadoras_id_cadastro_seq OWNED BY "tb_cad_cadastro_nfs_clientes_fontes_pagadoras"."id_cadastro";

-- AlterTable
CREATE SEQUENCE tb_cad_cadastro_nfs_pecas_id_cadastro_seq;
ALTER TABLE "tb_cad_cadastro_nfs_pecas" ALTER COLUMN "id_cadastro" SET DEFAULT nextval('tb_cad_cadastro_nfs_pecas_id_cadastro_seq');
ALTER SEQUENCE tb_cad_cadastro_nfs_pecas_id_cadastro_seq OWNED BY "tb_cad_cadastro_nfs_pecas"."id_cadastro";

-- AlterTable
CREATE SEQUENCE tb_cad_cadastro_nfs_servicos_id_cadastro_seq;
ALTER TABLE "tb_cad_cadastro_nfs_servicos" ALTER COLUMN "id_cadastro" SET DEFAULT nextval('tb_cad_cadastro_nfs_servicos_id_cadastro_seq');
ALTER SEQUENCE tb_cad_cadastro_nfs_servicos_id_cadastro_seq OWNED BY "tb_cad_cadastro_nfs_servicos"."id_cadastro";

-- AlterTable
CREATE SEQUENCE tb_cad_cadastro_os_id_cadastro_seq;
ALTER TABLE "tb_cad_cadastro_os" ALTER COLUMN "id_cadastro" SET DEFAULT nextval('tb_cad_cadastro_os_id_cadastro_seq');
ALTER SEQUENCE tb_cad_cadastro_os_id_cadastro_seq OWNED BY "tb_cad_cadastro_os"."id_cadastro";

-- AlterTable
CREATE SEQUENCE tb_cad_cadastro_os_nfs_id_cadastro_seq;
ALTER TABLE "tb_cad_cadastro_os_nfs" ALTER COLUMN "id_cadastro" SET DEFAULT nextval('tb_cad_cadastro_os_nfs_id_cadastro_seq');
ALTER SEQUENCE tb_cad_cadastro_os_nfs_id_cadastro_seq OWNED BY "tb_cad_cadastro_os_nfs"."id_cadastro";

-- AlterTable
CREATE SEQUENCE tb_cad_cadastro_os_servicos_id_cadastro_seq;
ALTER TABLE "tb_cad_cadastro_os_servicos" ALTER COLUMN "id_cadastro" SET DEFAULT nextval('tb_cad_cadastro_os_servicos_id_cadastro_seq');
ALTER SEQUENCE tb_cad_cadastro_os_servicos_id_cadastro_seq OWNED BY "tb_cad_cadastro_os_servicos"."id_cadastro";

-- CreateIndex
CREATE UNIQUE INDEX "tb_cad_cadastro_os_clientes_nome_cpf_cnpj_key" ON "tb_cad_cadastro_os_clientes"("nome", "cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "tb_cki_fontes_pagadoras_id_key" ON "tb_cki_fontes_pagadoras"("id");
