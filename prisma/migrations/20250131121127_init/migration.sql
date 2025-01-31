/*
  Warnings:

  - A unique constraint covering the columns `[category,message,startDate,endDate]` on the table `ErrorLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ErrorLog_category_message_startDate_endDate_key" ON "ErrorLog"("category", "message", "startDate", "endDate");
