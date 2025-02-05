/*
  Warnings:

  - A unique constraint covering the columns `[day,month,year]` on the table `DailyCk` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DailyCk_day_month_year_key" ON "DailyCk"("day", "month", "year");
