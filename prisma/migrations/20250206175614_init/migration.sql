/*
  Warnings:

  - Added the required column `desc_cos` to the `tb_cad_cadastro_os_servicos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Emails" ADD COLUMN     "clientesId" INTEGER;

-- AlterTable
ALTER TABLE "Telefones" ADD COLUMN     "clientesId" INTEGER;

-- AlterTable
ALTER TABLE "tb_cad_cadastro_os_servicos" ADD COLUMN     "desc_cos" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Clientes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "complemento" TEXT,
    "osId" INTEGER,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Os" (
    "id" SERIAL NOT NULL,
    "numero_os" TEXT NOT NULL,
    "data_abertura" TIMESTAMP(3) NOT NULL,
    "data_fechamento" TIMESTAMP(3),
    "valor_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "id_nf" INTEGER NOT NULL,

    CONSTRAINT "Os_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotaFiscal" (
    "id" SERIAL NOT NULL,
    "numero_nf" TEXT NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL,
    "valor_total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "NotaFiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pecas" (
    "id" SERIAL NOT NULL,
    "osId" INTEGER,
    "notaFiscalId" INTEGER,

    CONSTRAINT "Pecas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicos" (
    "id" SERIAL NOT NULL,
    "osId" INTEGER,

    CONSTRAINT "Servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veiculos" (
    "id" SERIAL NOT NULL,
    "osId" INTEGER,

    CONSTRAINT "Veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cancelamentos" (
    "id" SERIAL NOT NULL,
    "osId" INTEGER,
    "notaFiscalId" INTEGER,
    "data_cancelamento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cancelamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FontesPagadoras" (
    "id" SERIAL NOT NULL,
    "fonte_pagadora" INTEGER NOT NULL,
    "descricao" TEXT,
    "notaFiscalId" INTEGER,

    CONSTRAINT "FontesPagadoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealers" (
    "id" SERIAL NOT NULL,
    "dn" TEXT NOT NULL,
    "nome" TEXT,
    "cnpj" TEXT,
    "endereco" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "cidade" TEXT,
    "uf" TEXT,
    "cep" TEXT,
    "telefone" TEXT,
    "status" TEXT,

    CONSTRAINT "Dealers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Os_numero_os_key" ON "Os"("numero_os");

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_clientesId_fkey" FOREIGN KEY ("clientesId") REFERENCES "Clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefones" ADD CONSTRAINT "Telefones_clientesId_fkey" FOREIGN KEY ("clientesId") REFERENCES "Clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_osId_fkey" FOREIGN KEY ("osId") REFERENCES "Os"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Os" ADD CONSTRAINT "Os_id_nf_fkey" FOREIGN KEY ("id_nf") REFERENCES "NotaFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pecas" ADD CONSTRAINT "Pecas_osId_fkey" FOREIGN KEY ("osId") REFERENCES "Os"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pecas" ADD CONSTRAINT "Pecas_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "NotaFiscal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicos" ADD CONSTRAINT "Servicos_osId_fkey" FOREIGN KEY ("osId") REFERENCES "Os"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veiculos" ADD CONSTRAINT "Veiculos_osId_fkey" FOREIGN KEY ("osId") REFERENCES "Os"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancelamentos" ADD CONSTRAINT "Cancelamentos_osId_fkey" FOREIGN KEY ("osId") REFERENCES "Os"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancelamentos" ADD CONSTRAINT "Cancelamentos_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "NotaFiscal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FontesPagadoras" ADD CONSTRAINT "FontesPagadoras_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "NotaFiscal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
