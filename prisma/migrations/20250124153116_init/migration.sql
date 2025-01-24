/*
  Warnings:

  - Added the required column `jobId` to the `CkLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CkLogs" ADD COLUMN     "jobId" INTEGER NOT NULL;
