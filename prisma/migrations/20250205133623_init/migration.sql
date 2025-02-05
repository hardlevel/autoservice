-- AlterTable
ALTER TABLE "ErrorLogger" ADD COLUMN     "originalData" TEXT;

-- CreateTable
CREATE TABLE "DailyCk" (
    "id" SERIAL NOT NULL,
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
