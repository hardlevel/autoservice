/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `LastParams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LastParams_year_key" ON "LastParams"("year");
