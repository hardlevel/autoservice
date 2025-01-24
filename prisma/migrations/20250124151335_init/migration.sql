/*
  Warnings:

  - Added the required column `jobId` to the `JobLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobLogs" ADD COLUMN     "jobId" INTEGER NOT NULL;
