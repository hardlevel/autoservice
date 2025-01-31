-- CreateTable
CREATE TABLE "ErrorLog" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,
    "message" TEXT,
    "code" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);
