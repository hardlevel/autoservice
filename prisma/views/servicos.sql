CREATE VIEW "public"."servicos_view" AS
SELECT
    ck7004.id,
    ck7004.cos,
    ck7001.numero_da_os,
    ck7001.numero_da_nota_fiscal,
    ck7001.numero_do_dn,
    ck7001.fonte_pagadora,
    ck7004.descricao_do_servico,
    ck7004.hora_vendida,
    ck7004.tipo_de_servico,
    ck7004.valor_total_liquido_da_mao_de_obra,
    ck7001.data_e_hora_da_abertura_da_os,
    ck7001.data_e_hora_da_emissao_da_nota_fiscal,
    ck7002.uf,
    'Ck7001' AS parent,
    ck7004.ck7001_id AS parent_id
FROM "Ck7004" ck7004
JOIN "Ck7001" ck7001 ON ck7004.ck7001_id = ck7004.id
LEFT JOIN "Ck7002" ck7002 ON ck7001.id = ck7002.ck7001_id

UNION ALL

SELECT
    ck6031.id,
    ck6031.cos,
    ck6011.numero_da_os,
    NULL AS numero_da_nota_fiscal,
    ck6011.numero_do_dn,
    ck6011.fonte_pagadora,
    ck6031.descricao_do_servico,
    ck6031.hora_vendida,
    ck6031.tipo_de_servico,
    ck6031.valor_total_liquido_da_mao_de_obra,
    ck6011.data_e_hora_da_abertura_da_os,
    NULL AS data_e_hora_da_emissao_da_nota_fiscal,
    ck6042.uf,
    'Ck6011' AS parent,
    ck6031.ck6011_id AS parent_id
FROM "Ck6031" ck6031
LEFT JOIN "Ck6011" ck6011 ON ck6031.ck6011_id = ck6011.id
LEFT JOIN "Ck6041" ck6041 ON ck6011.id = ck6041.ck6011_id
LEFT JOIN "Ck6042" ck6042 ON ck6041.id = ck6042.ck6041_id;
