-- DropForeignKey
ALTER TABLE "FontesPagadoras" DROP CONSTRAINT "FontesPagadoras_nf_id_fkey";

-- AlterTable
ALTER TABLE "NotaFiscal" ADD COLUMN     "fonte_pagadora_id" INTEGER;

-- AddForeignKey
ALTER TABLE "NotaFiscal" ADD CONSTRAINT "NotaFiscal_fonte_pagadora_id_fkey" FOREIGN KEY ("fonte_pagadora_id") REFERENCES "FontesPagadoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;
