CREATE VIEW "public"."fontes_pagadoras_view" AS
SELECT
    ck3001.id,
    ck3001.numero_da_nota_fiscal,
    ck3001.serie_da_nota_fiscal,
    nf.id AS nota_fiscal_id,
    NULL AS numero_da_os,
    NULL AS os_id,
    ck3001.numero_do_dn,
    ck3001.fonte_pagadora,
    fp.id AS fonte_pagadora_id,
    ck3001.indicador,
    'Ck3001' AS parent,
    ck3001.id AS parent_id
FROM "Ck3001" ck3001
LEFT JOIN "tb_cki_fontes_pagadoras" fp ON fp.id = ck3001.fonte_pagadora
LEFT JOIN "tb_cad_cadastro_nfs" nf ON nf.id_nf = ck3001.numero_da_nota_fiscal AND nf.serie_nf = ck3001.serie_da_nota_fiscal

UNION ALL

SELECT
    ck6011.id,
    NULL AS numero_da_nota_fiscal,
    NULL AS serie_da_nota_fiscal,
    NULL AS nota_fiscal_id,
    ck6011.numero_da_os,
    os.id AS os_id,
    ck6011.numero_do_dn,
    ck6011.fonte_pagadora,
    fp.id AS fonte_pagadora_id,
    ck6041.indicador,
    'Ck6011' AS parent,
    ck6011.id AS parent_id
FROM "Ck6011" ck6011
LEFT JOIN "Ck6041" ck6041 ON ck6041.ck6011_id = ck6011.id
LEFT JOIN "tb_cki_fontes_pagadoras" fp ON fp.id = ck6011.fonte_pagadora
LEFT JOIN "tb_cad_cadastro_os" os ON os.os = ck6011.numero_da_os

UNION ALL

SELECT
    ck7001.id,
    ck7001.numero_da_nota_fiscal,
    ck7001.serie_da_nota_fiscal,
    nf.id AS nota_fiscal_id,
    ck7001.numero_da_os,
    os.id AS ordem_servico_id,
    ck7001.numero_do_dn,
    ck7001.fonte_pagadora,
    fp.id AS fonte_pagadora_id,
    ck7002.indicador,
    'CK7001' AS parent,
    ck7001.id AS parent_id
FROM "Ck7001" ck7001
LEFT JOIN "Ck7002" ck7002 ON ck7002.ck7001_id = ck7001.id
LEFT JOIN "tb_cki_fontes_pagadoras" fp ON fp.id = ck7001.fonte_pagadora
LEFT JOIN "tb_cad_cadastro_nfs" nf ON nf.id_nf = ck7001.numero_da_nota_fiscal AND nf.serie_nf = ck7001.serie_da_nota_fiscal
LEFT JOIN "tb_cad_cadastro_os" os ON os.os = ck7001.numero_da_os
