CREATE VIEW "public"."pecas_view"
AS
 SELECT p3.id,
    p3.codigo_da_peca,
    p3.descricao_da_peca,
    p3.quantidade_da_peca,
    p3.valor_total_liquido_da_peca,
    p3.codigo_promocional,
    'Ck3001'::text AS parent,
    p3.ck3001_id AS parent_id
   FROM "Ck3003" p3
  WHERE (p3.ck3001_id IS NOT NULL)
UNION ALL
 SELECT p7.id,
    p7.codigo_da_peca,
    p7.descricao_da_peca,
    p7.quantidade_da_peca,
    p7.valor_total_liquido_da_peca,
    p7.codigo_promocional,
    'Ck7001'::text AS parent,
    p7.ck7001_id AS parent_id
   FROM "Ck7003" p7
  WHERE (p7.ck7001_id IS NOT NULL)
UNION ALL
 SELECT
    p6021.id,
    p6021.codigo_da_peca,
    p6021.descricao_da_peca,
    p6021.quantidade_da_peca,
    p6021.valor_total_liquido_da_peca,
    p6021.codigo_promocional,
    'Ck6011'::text AS parent,
    p6021.ck6011_id AS parent_id
   FROM "Ck6021" p6021
  WHERE (p6021.ck6011_id IS NOT NULL);;
