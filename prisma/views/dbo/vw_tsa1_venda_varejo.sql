SELECT
  vrj901.id_cadastro,
  vrj901.chassis,
  isnull(
    vrj902.cliente_arrendatario,
    vrj.comprador_principal
  ) AS nome_cliente,
  vrj.comprador_principal AS nome_comprador,
  isnull(vrj902.ddd_res, vrj.ddd_res) AS ddd_res_cliente,
  isnull(vrj902.tel_res, vrj.tel_res) AS tel_res_cliente,
  isnull(vrj902.ddd_com, vrj.ddd_com) AS ddd_com_cliente,
  isnull(vrj902.tel_com, vrj.tel_com) AS tel_com_cliente,
  isnull(vrj903.ddd_celular, vrj901.ddd_celular) AS ddd_celular,
  isnull(vrj903.tel_celular, vrj901.tel_celular) AS tel_celular,
  vrj901.data_venda,
  vrj.tipo_pessoa,
  tpag.id_tipo_pagamento,
  tpag.desc_tipo_pagamento,
  isnull(vrj903.tipo_pessoa, vrj.tipo_pessoa) AS tipo_pessoa_cliente,
  vrj901.numero_nf,
  isnull(vrjacer.vlr_nf, vrj901.vlr_nf) AS vlr_nf,
  est.id_modelo,
  est.desc_modelo,
  fam.id_familia,
  fam.desc_familia,
  fam.estoque
FROM
  tb_tsa_varejo AS vrj
  JOIN tb_tsa_varejo_901 AS vrj901 ON (
    vrj901.chassis = vrj.chassis
    AND vrj901.id_cadastro = vrj.id_cadastro
  )
  JOIN tb_tsa_tipos_pagamentos AS tpag ON (
    tpag.id_tipo_pagamento = vrj901.id_tipo_pagamento
  )
  LEFT JOIN tb_tsa_varejo_902 AS vrj902 ON (
    vrj902.chassis = vrj.chassis
    AND vrj902.id_cadastro = vrj.id_cadastro
  )
  LEFT JOIN tb_tsa_varejo_903 AS vrj903 ON (
    vrj903.chassis = vrj.chassis
    AND vrj903.id_cadastro = vrj.id_cadastro
  )
  LEFT JOIN tb_tsa_varejo_901_acertos AS vrjacer ON (
    vrjacer.chassis = vrj.chassis
    AND vrjacer.id_cadastro = vrj.id_cadastro
  )
  JOIN tb_est_modelos AS est ON (est.id_modelo = vrj.id_modelo)
  JOIN tb_est_familias AS fam ON (fam.id_familia = est.id_familia)
WHERE
  vrj.id_status_varejo <> 0;