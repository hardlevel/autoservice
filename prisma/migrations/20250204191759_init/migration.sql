/*
  Warnings:

  - You are about to drop the `Errors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Errors";

-- CreateTable
CREATE TABLE "ErrorLogger" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,
    "message" TEXT,
    "code" TEXT,
    "params" TEXT,

    CONSTRAINT "ErrorLogger_pkey" PRIMARY KEY ("id")
);
