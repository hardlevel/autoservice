SELECT
  osfte.id_os,
  osfte.id_fonte_pagadora,
  fte.desc_fonte_pagadora,
  osfte.data_abertura_os,
  osfte.data_fechamento_os,
  osfte.total_os,
  osfte.total_orcamento,
  osfte.total_peca_os,
  osfte.total_mo_os,
  osfte.total_peca_orcamento,
  osfte.total_mo_orcamento,
  osfte.gera_nf,
  osfte.nr_orcamento,
  osfte.data_orcamento,
  osfte.chassis,
  osfte.placa,
  osfte.certificacao,
  osfte.km
FROM
  vw_tsa1_venda_varejo AS vend
  JOIN tb_cad_cadastro_os_chassis AS os ON (os.chassis = vend.chassis)
  JOIN tb_cad_cadastro_os_fontes_pagadoras AS osfte ON (
    osfte.chassis = os.chassis
    AND osfte.id_cadastro = os.id_cadastro
    AND osfte.id_os = os.id_os
  )
  JOIN tb_cki_fontes_pagadoras AS fte ON (fte.id_fonte_pagadora = osfte.id_fonte_pagadora);