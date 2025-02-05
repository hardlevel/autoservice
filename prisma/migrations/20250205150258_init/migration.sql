-- CreateTable
CREATE TABLE "tb_cki_fontes_pagadoras" (
    "id" SERIAL NOT NULL,
    "desc_fonte_pagadora" TEXT NOT NULL,
    "obs_fonte_pagadora" TEXT,

    CONSTRAINT "tb_cki_fontes_pagadoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_cki_agrupamento_fontes_pagadoras" (
    "id" SERIAL NOT NULL,
    "desc_agrupamento" TEXT NOT NULL,

    CONSTRAINT "tb_cki_agrupamento_fontes_pagadoras_pkey" PRIMARY KEY ("id")
);
