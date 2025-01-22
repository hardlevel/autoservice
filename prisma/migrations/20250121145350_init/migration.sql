/*
  Warnings:

  - Added the required column `endereco` to the `Ck3001` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Ck3001` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Ck3002` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ck3001" ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ALTER COLUMN "data_registro" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ck3002" ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "email_comercial" TEXT,
ADD COLUMN     "email_pessoal" TEXT,
ADD COLUMN     "telefone_celular" TEXT,
ADD COLUMN     "telefone_comercial" TEXT,
ADD COLUMN     "telefone_residencial" TEXT;
