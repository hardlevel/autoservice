SELECT
  fte.id_fonte_pagadora,
  fte.desc_fonte_pagadora,
  os.chassis,
  os.id_cadastro,
  os.id_os,
  osfte.km,
  osfte.data_abertura_os,
  osfte.data_fechamento_os,
  osfte.placa,
  osfte.total_mo_os,
  osfte.total_peca_os,
  osfte.total_os,
  serv.id_seq_servico,
  serv.desc_cos,
  serv.id_cos,
  serv.hora_vendida
FROM
  tb_cad_cadastro_os_chassis AS os
  JOIN tb_cad_cadastro_os_fontes_pagadoras AS osfte ON (
    osfte.chassis = os.chassis
    AND osfte.id_cadastro = os.id_cadastro
    AND osfte.id_os = os.id_os
  )
  JOIN tb_cki_fontes_pagadoras AS fte ON (fte.id_fonte_pagadora = osfte.id_fonte_pagadora)
  JOIN tb_cad_cadastro_os_servicos AS serv ON (
    serv.id_cadastro = osfte.id_cadastro
    AND serv.id_fonte_pagadora = osfte.id_fonte_pagadora
    AND serv.id_os = osfte.id_os
  );