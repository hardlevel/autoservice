-- CreateTable
CREATE TABLE "Emails" (
    "id" SERIAL NOT NULL,
    "ck3002_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "autoriza_contato" BOOLEAN NOT NULL,
    "autoriza_pesquisa" BOOLEAN NOT NULL,

    CONSTRAINT "Emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telefones" (
    "id" SERIAL NOT NULL,
    "ck3002_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "autoriza_contato" BOOLEAN NOT NULL,
    "autoriza_pesquisa" BOOLEAN NOT NULL,

    CONSTRAINT "Telefones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_ck3002_id_fkey" FOREIGN KEY ("ck3002_id") REFERENCES "Ck3002"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefones" ADD CONSTRAINT "Telefones_ck3002_id_fkey" FOREIGN KEY ("ck3002_id") REFERENCES "Ck3002"("id") ON DELETE CASCADE ON UPDATE CASCADE;
