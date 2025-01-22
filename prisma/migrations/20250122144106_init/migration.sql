/*
  Warnings:

  - Added the required column `endereco` to the `Ck7001` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_do_cliente` to the `Ck7001` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bairro` to the `Ck7002` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Ck7002` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf_cnpj` to the `Ck7002` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Ck7002` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ck7001" ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "nome_do_cliente" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ck7002" ADD COLUMN     "bairro" TEXT NOT NULL,
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "cpf_cnpj" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Emails" ADD COLUMN     "ck7002_id" INTEGER;

-- AlterTable
ALTER TABLE "Telefones" ADD COLUMN     "ck7002_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_ck7002_id_fkey" FOREIGN KEY ("ck7002_id") REFERENCES "Ck7002"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefones" ADD CONSTRAINT "Telefones_ck7002_id_fkey" FOREIGN KEY ("ck7002_id") REFERENCES "Ck7002"("id") ON DELETE CASCADE ON UPDATE CASCADE;
