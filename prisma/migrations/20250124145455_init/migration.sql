-- CreateTable
CREATE TABLE "CkLogs" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "data" TEXT,
    "qtd" INTEGER,
    "status" TEXT NOT NULL,
    "message" TEXT,

    CONSTRAINT "CkLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobLogs" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "startDate" TEXT,
    "endDate" TEXT,
    "status" TEXT NOT NULL,
    "message" TEXT,

    CONSTRAINT "JobLogs_pkey" PRIMARY KEY ("id")
);
