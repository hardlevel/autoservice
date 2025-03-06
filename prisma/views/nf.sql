CREATE VIEW "public"."nf_view" AS
SELECT
    c7.id,
    c7.numero_da_nota_fiscal,
    c7.serie_da_nota_fiscal,
    c7.fonte_pagadora,
    c7.valor_total_liquido_das_pecas_na_nota_fiscal,
    c7.valor_total_liquido_da_mao_de_obra_na_nota_fiscal,
    c7.data_e_hora_da_abertura_da_os,
    c7.data_e_hora_da_emissao_da_nota_fiscal,
    c7.data_e_hora_do_fechamento_da_os,
    (SELECT ck2.indicador FROM "Ck7002" ck2 WHERE ck2.ck7001_id = c7.id LIMIT 1) AS indicador,
    'Ck7001'::text AS categoria
FROM "Ck7001" c7
UNION ALL
SELECT
    c3.id,
    c3.numero_da_nota_fiscal,
    c3.serie_da_nota_fiscal,
    c3.fonte_pagadora,
    c3.valor_total_liquido_das_pecas_na_nota_fiscal,
    0 AS valor_total_liquido_da_mao_de_obra_na_nota_fiscal,
    NULL::timestamp without time zone AS data_e_hora_da_abertura_da_os,
    c3.data_e_hora_da_emissao_da_nota_fiscal,
    NULL::timestamp without time zone AS data_e_hora_do_fechamento_da_os,
    c3.indicador,
    'Ck3001'::text AS categoria
FROM "Ck3001" c3;