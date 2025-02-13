CREATE VIEW "public"."servicos_view" AS
SELECT
    ck7004.id,
    ck7004.cos,
    ck7004.descricao_do_servico,
    ck7004.hora_vendida,
    ck7004.tipo_de_servico,
    ck7004.valor_total_liquido_da_mao_de_obra,
    ck7001.numero_da_os,
    ck7001.numero_do_dn,
    ck7001.fonte_pagadora,
    'Ck7001' AS parent,
    ck7004.ck7001_id AS parent_id
FROM "Ck7004" ck7004
LEFT JOIN "Ck7001" ck7001 ON ck7004.ck7001_id = ck7001.id

UNION ALL

SELECT
    ck6031.id,
    ck6031.cos,
    ck6031.descricao_do_servico,
    ck6031.hora_vendida,
    ck6031.tipo_de_servico,
    ck6031.valor_total_liquido_da_mao_de_obra,
    ck6011.numero_da_os,
    ck6011.numero_do_dn,
    ck6011.fonte_pagadora,
    'Ck6011' AS parent,
    ck6031.ck6011_id AS parent_id
FROM "Ck6031" ck6031
LEFT JOIN "Ck6011" ck6011 ON ck6031.ck6011_id = ck6011.id
