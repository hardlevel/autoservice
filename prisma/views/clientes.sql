-- CREATE VIEW "public"."clientes_view" AS
 SELECT
    ck3001.id AS id,
    ck3001.nome_do_cliente,
    ck3001.cpf_cnpj,
    ck3001.endereco,
    ck3001.complemento,
    ck3001.numero,
    ck3002.bairro,
    ck3002.cidade,
    ck3002.uf,
    ck3002.cep,
    ck3001.fonte_pagadora,
    ck3001.indicador,
    'Ck3001' AS parent,
    ck3001.id AS parent_id,
    max(
        CASE
            WHEN (t.descricao ~~* 'Residencial'::text) THEN t.numero
            ELSE NULL::text
        END) AS tel_res,
    max(
        CASE
            WHEN (t.descricao ~~* 'Comercial'::text) THEN t.numero
            ELSE NULL::text
        END) AS tel_com,
    max(
        CASE
            WHEN (t.descricao ~~* 'Celular'::text) THEN t.numero
            ELSE NULL::text
        END) AS tel_cel,
    max(
        CASE
            WHEN (e.descricao ~~* 'Residencial'::text) THEN e.email
            ELSE NULL::text
        END) AS email_res,
    max(
        CASE
            WHEN (e.descricao ~~* 'Comercial'::text) THEN e.email
            ELSE NULL::text
        END) AS email_com
        -- CASE
        --     WHEN (p.ck7001_id IS NOT NULL) THEN 'Ck7001'::text
        --     WHEN (c6.ck6011_id IS NOT NULL) THEN 'Ck6011'::text
        --     ELSE 'Ck3001'::text
        -- END AS parent,
        -- CASE
        --     WHEN (p.ck7001_id IS NOT NULL) THEN p.ck7001_id
        --     WHEN (c6.ck6011_id IS NOT NULL) THEN c6.ck6011_id
        --     ELSE c1.id
        -- END AS parent_id
FROM "Ck3001" ck3001
LEFT JOIN "Ck3002" ck3002 ON ck3002.ck3001_id = ck3001.id
LEFT JOIN "Telefones" t ON ((t.ck3002_id = ck3002.id))
LEFT JOIN "Emails" e ON ((e.ck3002_id = ck3002.id))
GROUP BY
    ck3001.id,
    ck3001.nome_do_cliente,
    ck3001.cpf_cnpj,
    ck3001.endereco,
    ck3001.complemento,
    ck3001.numero,
    ck3002.bairro,
    ck3002.cidade,
    ck3002.uf,
    ck3002.cep,
    ck3001.fonte_pagadora,
    ck3001.indicador

UNION ALL

SELECT
    ck6041.id AS id,
    ck6041.nome_do_cliente,
    ck6041.cpf_cnpj,
    ck6041.endereco,
    ck6041.complemento,
    ck6041.numero,
    ck6041.bairro,
    ck6042.cidade,
    ck6042.uf,
    ck6042.cep,
    ck6011.fonte_pagadora,
    ck6041.indicador,
    'Ck6011' AS parent,
    ck6041.ck6011_id AS parent_id,
    max(
        CASE
            WHEN (t.descricao ~~* 'Residencial'::text) THEN t.numero
            ELSE NULL::text
        END) AS tel_res,
    max(
        CASE
            WHEN (t.descricao ~~* 'Comercial'::text) THEN t.numero
            ELSE NULL::text
        END) AS tel_com,
    max(
        CASE
            WHEN (t.descricao ~~* 'Celular'::text) THEN t.numero
            ELSE NULL::text
        END) AS tel_cel,
    max(
        CASE
            WHEN (e.descricao ~~* 'Residencial'::text) THEN e.email
            ELSE NULL::text
        END) AS email_res,
    max(
        CASE
            WHEN (e.descricao ~~* 'Comercial'::text) THEN e.email
            ELSE NULL::text
        END) AS email_com
        -- CASE
        --     WHEN (p.ck7001_id IS NOT NULL) THEN 'Ck7001'::text
        --     WHEN (c6.ck6011_id IS NOT NULL) THEN 'Ck6011'::text
        --     ELSE 'Ck3001'::text
        -- END AS parent,
        -- CASE
        --     WHEN (p.ck7001_id IS NOT NULL) THEN p.ck7001_id
        --     WHEN (c6.ck6011_id IS NOT NULL) THEN c6.ck6011_id
        --     ELSE c1.id
        -- END AS parent_id
FROM "Ck6041" ck6041
LEFT JOIN "Ck6042" ck6042 ON ck6042.ck6041_id = ck6041.id
LEFT JOIN "Ck6011" ck6011 ON ck6011.id = ck6041.ck6011_id
LEFT JOIN "Telefones" t ON ((t.ck6042_id = ck6042.id))
LEFT JOIN "Emails" e ON ((e.ck6042_id = ck6042.id))
GROUP BY
    ck6041.id,
    ck6041.nome_do_cliente,
    ck6041.cpf_cnpj,
    ck6041.endereco,
    ck6041.complemento,
    ck6041.numero,
    ck6041.bairro,
    ck6042.cidade,
    ck6042.uf,
    ck6042.cep,
    ck6011.fonte_pagadora,
    ck6041.indicador

UNION ALL

SELECT
    ck7001.id AS id,
    ck7001.nome_do_cliente,
    ck7002.cpf_cnpj,
    ck7001.endereco,
    ck7002.complemento,
    ck7002.numero,
    ck7002.bairro,
    ck7002.cidade,
    ck7002.uf,
    ck7002.cep,
    ck7001.fonte_pagadora,
    ck7002.indicador,
    'Ck7001' AS parent,
    ck7001.id AS parent_id,
    max(
        CASE
            WHEN (t.descricao ~~* 'Residencial'::text) THEN t.numero
            ELSE NULL::text
        END) AS tel_res,
    max(
        CASE
            WHEN (t.descricao ~~* 'Comercial'::text) THEN t.numero
            ELSE NULL::text
        END) AS tel_com,
    max(
        CASE
            WHEN (t.descricao ~~* 'Celular'::text) THEN t.numero
            ELSE NULL::text
        END) AS tel_cel,
    max(
        CASE
            WHEN (e.descricao ~~* 'Residencial'::text) THEN e.email
            ELSE NULL::text
        END) AS email_res,
    max(
        CASE
            WHEN (e.descricao ~~* 'Comercial'::text) THEN e.email
            ELSE NULL::text
        END) AS email_com
        -- CASE
        --     WHEN (p.ck7001_id IS NOT NULL) THEN 'Ck7001'::text
        --     WHEN (c6.ck6011_id IS NOT NULL) THEN 'Ck6011'::text
        --     ELSE 'Ck3001'::text
        -- END AS parent,
        -- CASE
        --     WHEN (p.ck7001_id IS NOT NULL) THEN p.ck7001_id
        --     WHEN (c6.ck6011_id IS NOT NULL) THEN c6.ck6011_id
        --     ELSE c1.id
        -- END AS parent_id
FROM "Ck7001" ck7001
LEFT JOIN "Ck7002" ck7002 ON ck7002.ck7001_id = ck7001.id
LEFT JOIN "Telefones" t ON ((t.ck7002_id = ck7002.id))
LEFT JOIN "Emails" e ON ((e.ck7002_id = ck7002.id))
GROUP BY
    ck7001.id,
    ck7001.nome_do_cliente,
    ck7002.cpf_cnpj,
    ck7001.endereco,
    ck7002.complemento,
    ck7002.numero,
    ck7002.bairro,
    ck7002.cidade,
    ck7002.uf,
    ck7002.cep,
    ck7001.fonte_pagadora,
    ck7002.indicador