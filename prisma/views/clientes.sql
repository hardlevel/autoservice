CREATE VIEW "public"."clientes_view"
AS
SELECT
    c1.id AS id,
    c1.nome_do_cliente,
    c1.cpf_cnpj,
    c1.endereco,
    c1.complemento,
    c1.numero,
    c2.bairro,
    c2.cidade,
    c2.uf,
    c2.cep,
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
        END) AS email_com,
    CASE
        WHEN (p.ck7001_id IS NOT NULL) THEN 'Ck7001'::text
        WHEN (c6.ck6011_id IS NOT NULL) THEN 'Ck6011'::text
        ELSE 'Ck3001'::text
    END AS parent,
    CASE
        WHEN (p.ck7001_id IS NOT NULL) THEN p.ck7001_id
        WHEN (c6.ck6011_id IS NOT NULL) THEN c6.ck6011_id
        ELSE c1.id
    END AS parent_id,

    -- Unindo o campo "indicador" de todas as tabelas em um único campo
    CASE
        WHEN (p.indicador IS NOT NULL) THEN p.indicador
        WHEN (c6.indicador IS NOT NULL) THEN c6.indicador
        ELSE c1.indicador
    END AS indicador

FROM
    (((((("Ck3001" c1
    JOIN "Ck3002" c2 ON ((c1.id = c2.ck3001_id)))
    LEFT JOIN "Telefones" t ON ((t.ck3002_id = c2.id)))
    LEFT JOIN "Emails" e ON ((e.ck3002_id = c2.id)))
    LEFT JOIN "Ck7002" p ON (((p.cpf_cnpj = c1.cpf_cnpj) AND (p.id <> c1.id))))
    LEFT JOIN "Ck6041" c6 ON ((c6.cpf_cnpj = c1.cpf_cnpj)))
    LEFT JOIN "Ck6042" c7 ON ((c7.ck6041_id = c6.id)))
GROUP BY
    c1.id, c1.nome_do_cliente, c1.cpf_cnpj, c1.endereco, c1.complemento, c1.numero,
    c2.bairro, c2.cidade, c2.uf, c2.cep, p.ck7001_id, c6.ck6011_id, p.indicador, c6.indicador, c1.indicador;
