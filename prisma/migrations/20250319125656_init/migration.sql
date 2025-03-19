-- CreateTable
CREATE TABLE "LastSearch" (
    "id" INTEGER NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LastSearch_id_key" ON "LastSearch"("id");
