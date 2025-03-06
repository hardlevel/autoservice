CREATE VIEW "public"."servicos_view" AS
SELECT
    c7.id,
    c7.cos,
    c7.descricao_do_servico,
    c7.hora_vendida,
    c7.tipo_de_servico,
    c7.valor_total_liquido_da_mao_de_obra,
    'Ck7001' AS parent,
    c7.ck7001_id AS parent_id
FROM "Ck7004" c7

UNION ALL

SELECT
    c6.id,
    c6.cos,
    c6.descricao_do_servico,
    c6.hora_vendida,
    c6.tipo_de_servico,
    c6.valor_total_liquido_da_mao_de_obra,
    'Ck6011' AS parent,
    c6.ck6011_id AS parent_id
FROM "Ck6031" c6;