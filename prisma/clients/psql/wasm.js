
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.5.0
 * Query Engine version: 173f8d54f8d52e692c7e27e72a88314ec7aeff60
 */
Prisma.prismaVersion = {
  client: "6.5.0",
  engine: "173f8d54f8d52e692c7e27e72a88314ec7aeff60"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.Ck3001ScalarFieldEnum = {
  id: 'id',
  numero_do_dn: 'numero_do_dn',
  numero_da_nota_fiscal: 'numero_da_nota_fiscal',
  serie_da_nota_fiscal: 'serie_da_nota_fiscal',
  fonte_pagadora: 'fonte_pagadora',
  valor_total_liquido_das_pecas_na_nota_fiscal: 'valor_total_liquido_das_pecas_na_nota_fiscal',
  indicador: 'indicador',
  data_e_hora_da_emissao_da_nota_fiscal: 'data_e_hora_da_emissao_da_nota_fiscal',
  numero: 'numero',
  endereco: 'endereco',
  complemento: 'complemento',
  nome_do_cliente: 'nome_do_cliente',
  cpf_cnpj: 'cpf_cnpj',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.RelationLoadStrategy = {
  query: 'query',
  join: 'join'
};

exports.Prisma.Ck3002ScalarFieldEnum = {
  id: 'id',
  cidade: 'cidade',
  bairro: 'bairro',
  uf: 'uf',
  cep: 'cep',
  ck3001_id: 'ck3001_id',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck3003ScalarFieldEnum = {
  id: 'id',
  codigo_da_peca: 'codigo_da_peca',
  descricao_da_peca: 'descricao_da_peca',
  quantidade_da_peca: 'quantidade_da_peca',
  valor_total_liquido_da_peca: 'valor_total_liquido_da_peca',
  codigo_promocional: 'codigo_promocional',
  ck3001_id: 'ck3001_id',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck4001ScalarFieldEnum = {
  id: 'id',
  tipo_do_cancelamento: 'tipo_do_cancelamento',
  numero_do_dn: 'numero_do_dn',
  numero_da_nota_fiscal: 'numero_da_nota_fiscal',
  numero_da_os: 'numero_da_os',
  serie_da_nota_fiscal: 'serie_da_nota_fiscal',
  data_e_hora_da_emissao_da_nota_fiscal: 'data_e_hora_da_emissao_da_nota_fiscal',
  data_do_cancelamento_do_documento: 'data_do_cancelamento_do_documento',
  data_e_hora_da_abertura_da_os: 'data_e_hora_da_abertura_da_os',
  data_e_hora_do_fechamento_da_os: 'data_e_hora_do_fechamento_da_os',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck5001ScalarFieldEnum = {
  id: 'id',
  numero_do_dn: 'numero_do_dn',
  tempo_remunerado: 'tempo_remunerado',
  tempo_disponivel_servicos_gerais_produtivos: 'tempo_disponivel_servicos_gerais_produtivos',
  tempo_disponivel_servicos_rapido_produtivos: 'tempo_disponivel_servicos_rapido_produtivos',
  tempo_disponivel_servicos_carroceria_produtivos_funileiros: 'tempo_disponivel_servicos_carroceria_produtivos_funileiros',
  tempo_disponivel_servicos_carroceria_produtivos_pintores: 'tempo_disponivel_servicos_carroceria_produtivos_pintores',
  taxa_de_mao_de_obra_publico: 'taxa_de_mao_de_obra_publico',
  servicos_gerente: 'servicos_gerente',
  servicos_chefe_de_oficina: 'servicos_chefe_de_oficina',
  servicos_consultor_tecnico: 'servicos_consultor_tecnico',
  servicos_aprendiz: 'servicos_aprendiz',
  servicos_suporte: 'servicos_suporte',
  servicos_gerais_produtivos: 'servicos_gerais_produtivos',
  servicos_rapido_produtivos: 'servicos_rapido_produtivos',
  servicos_carroceria_produtivos_funileiros: 'servicos_carroceria_produtivos_funileiros',
  servicos_carroceria_produtivos_pintores: 'servicos_carroceria_produtivos_pintores',
  servicos_lavadores_lubrificadores: 'servicos_lavadores_lubrificadores',
  servicos_terceiros: 'servicos_terceiros',
  pecas_gerente: 'pecas_gerente',
  pecas_suporte: 'pecas_suporte',
  pecas_balconista_varejo: 'pecas_balconista_varejo',
  pecas_balconista_oficina: 'pecas_balconista_oficina',
  pecas_vendedor_atacado: 'pecas_vendedor_atacado',
  pecas_vendedor_acessorios: 'pecas_vendedor_acessorios',
  locais_de_trabalho_servicos_gerais: 'locais_de_trabalho_servicos_gerais',
  locais_de_trabalho_servico_rapido: 'locais_de_trabalho_servico_rapido',
  locais_de_trabalho_servicos_de_funilaria: 'locais_de_trabalho_servicos_de_funilaria',
  locais_de_trabalho_servicos_de_pintura: 'locais_de_trabalho_servicos_de_pintura',
  locais_de_trabalho_lavagem_e_lubrificacao: 'locais_de_trabalho_lavagem_e_lubrificacao',
  locais_de_trabalho_utilizados_por_terceiros: 'locais_de_trabalho_utilizados_por_terceiros',
  mes_e_ano_de_referencia: 'mes_e_ano_de_referencia',
  ano_de_referencia: 'ano_de_referencia',
  mes_de_referencia: 'mes_de_referencia',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck6011ScalarFieldEnum = {
  id: 'id',
  numero_do_dn: 'numero_do_dn',
  numero_da_os: 'numero_da_os',
  data_e_hora_da_abertura_da_os: 'data_e_hora_da_abertura_da_os',
  data_e_hora_do_fechamento_da_os: 'data_e_hora_do_fechamento_da_os',
  fonte_pagadora: 'fonte_pagadora',
  valor_total_liquido_das_pecas_na_os: 'valor_total_liquido_das_pecas_na_os',
  valor_total_liquido_da_mao_de_obra_na_os: 'valor_total_liquido_da_mao_de_obra_na_os',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck6021ScalarFieldEnum = {
  id: 'id',
  codigo_da_peca: 'codigo_da_peca',
  descricao_da_peca: 'descricao_da_peca',
  quantidade_da_peca: 'quantidade_da_peca',
  valor_total_liquido_da_peca: 'valor_total_liquido_da_peca',
  codigo_promocional: 'codigo_promocional',
  ck6011_id: 'ck6011_id',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck6031ScalarFieldEnum = {
  id: 'id',
  cos: 'cos',
  descricao_do_servico: 'descricao_do_servico',
  tipo_de_servico: 'tipo_de_servico',
  hora_vendida: 'hora_vendida',
  valor_total_liquido_da_mao_de_obra: 'valor_total_liquido_da_mao_de_obra',
  ck6011_id: 'ck6011_id',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck6041ScalarFieldEnum = {
  id: 'id',
  quilometragem_do_veiculo: 'quilometragem_do_veiculo',
  indicador: 'indicador',
  chassi_do_veiculo: 'chassi_do_veiculo',
  placa_do_veiculo: 'placa_do_veiculo',
  nome_do_cliente: 'nome_do_cliente',
  cpf_cnpj: 'cpf_cnpj',
  endereco: 'endereco',
  numero: 'numero',
  complemento: 'complemento',
  bairro: 'bairro',
  ck6011_id: 'ck6011_id',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck6042ScalarFieldEnum = {
  id: 'id',
  cidade: 'cidade',
  uf: 'uf',
  cep: 'cep',
  ck6041_id: 'ck6041_id',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck7001ScalarFieldEnum = {
  id: 'id',
  nome_do_cliente: 'nome_do_cliente',
  endereco: 'endereco',
  numero_do_dn: 'numero_do_dn',
  numero_da_nota_fiscal: 'numero_da_nota_fiscal',
  numero_da_os: 'numero_da_os',
  serie_da_nota_fiscal: 'serie_da_nota_fiscal',
  fonte_pagadora: 'fonte_pagadora',
  valor_total_liquido_das_pecas_na_nota_fiscal: 'valor_total_liquido_das_pecas_na_nota_fiscal',
  valor_total_liquido_da_mao_de_obra_na_nota_fiscal: 'valor_total_liquido_da_mao_de_obra_na_nota_fiscal',
  data_e_hora_da_abertura_da_os: 'data_e_hora_da_abertura_da_os',
  data_e_hora_da_emissao_da_nota_fiscal: 'data_e_hora_da_emissao_da_nota_fiscal',
  data_e_hora_do_fechamento_da_os: 'data_e_hora_do_fechamento_da_os',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck7002ScalarFieldEnum = {
  id: 'id',
  ck7001_id: 'ck7001_id',
  indicador: 'indicador',
  cidade: 'cidade',
  uf: 'uf',
  bairro: 'bairro',
  numero: 'numero',
  complemento: 'complemento',
  cpf_cnpj: 'cpf_cnpj',
  cep: 'cep',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck7003ScalarFieldEnum = {
  id: 'id',
  ck7001_id: 'ck7001_id',
  codigo_da_peca: 'codigo_da_peca',
  descricao_da_peca: 'descricao_da_peca',
  quantidade_da_peca: 'quantidade_da_peca',
  valor_total_liquido_da_peca: 'valor_total_liquido_da_peca',
  codigo_promocional: 'codigo_promocional',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.Ck7004ScalarFieldEnum = {
  id: 'id',
  ck7001_id: 'ck7001_id',
  cos: 'cos',
  descricao_do_servico: 'descricao_do_servico',
  hora_vendida: 'hora_vendida',
  valor_total_liquido_da_mao_de_obra: 'valor_total_liquido_da_mao_de_obra',
  tipo_de_servico: 'tipo_de_servico',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.EmailsScalarFieldEnum = {
  email: 'email',
  descricao: 'descricao',
  autoriza_contato: 'autoriza_contato',
  autoriza_pesquisa: 'autoriza_pesquisa',
  created_at: 'created_at',
  modified_at: 'modified_at',
  ck3002_id: 'ck3002_id',
  ck6042_id: 'ck6042_id',
  ck7002_id: 'ck7002_id'
};

exports.Prisma.ErrorLoggerScalarFieldEnum = {
  id: 'id',
  created_at: 'created_at',
  time: 'time',
  category: 'category',
  message: 'message',
  code: 'code',
  params: 'params',
  originalData: 'originalData'
};

exports.Prisma.CkLogsScalarFieldEnum = {
  id: 'id',
  created_at: 'created_at',
  startDate: 'startDate',
  endDate: 'endDate',
  category: 'category',
  data: 'data',
  qtd: 'qtd',
  status: 'status',
  message: 'message',
  jobId: 'jobId'
};

exports.Prisma.JobLogsScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  created_at: 'created_at',
  started_at: 'started_at',
  ended_at: 'ended_at',
  startDate: 'startDate',
  endDate: 'endDate',
  status: 'status',
  message: 'message',
  data: 'data'
};

exports.Prisma.DailyCkScalarFieldEnum = {
  id: 'id',
  day: 'day',
  month: 'month',
  year: 'year',
  hour: 'hour',
  minute: 'minute',
  ck3001: 'ck3001',
  ck3002: 'ck3002',
  ck3003: 'ck3003',
  ck4001: 'ck4001',
  ck5001: 'ck5001',
  ck6011: 'ck6011',
  ck6021: 'ck6021',
  ck6031: 'ck6031',
  ck6041: 'ck6041',
  ck6042: 'ck6042',
  ck7001: 'ck7001',
  ck7002: 'ck7002',
  ck7003: 'ck7003',
  ck7004: 'ck7004',
  status: 'status'
};

exports.Prisma.LastSearchScalarFieldEnum = {
  id: 'id',
  startDate: 'startDate',
  endDate: 'endDate'
};

exports.Prisma.LastParamsScalarFieldEnum = {
  day: 'day',
  month: 'month',
  year: 'year',
  hour: 'hour',
  status: 'status'
};

exports.Prisma.TelefonesScalarFieldEnum = {
  ck3002_id: 'ck3002_id',
  ck6042_id: 'ck6042_id',
  ck7002_id: 'ck7002_id',
  numero: 'numero',
  descricao: 'descricao',
  autoriza_contato: 'autoriza_contato',
  autoriza_pesquisa: 'autoriza_pesquisa',
  created_at: 'created_at',
  modified_at: 'modified_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Ck3001: 'Ck3001',
  Ck3002: 'Ck3002',
  Ck3003: 'Ck3003',
  Ck4001: 'Ck4001',
  Ck5001: 'Ck5001',
  Ck6011: 'Ck6011',
  Ck6021: 'Ck6021',
  Ck6031: 'Ck6031',
  Ck6041: 'Ck6041',
  Ck6042: 'Ck6042',
  Ck7001: 'Ck7001',
  Ck7002: 'Ck7002',
  Ck7003: 'Ck7003',
  Ck7004: 'Ck7004',
  Emails: 'Emails',
  ErrorLogger: 'ErrorLogger',
  CkLogs: 'CkLogs',
  JobLogs: 'JobLogs',
  DailyCk: 'DailyCk',
  LastSearch: 'LastSearch',
  LastParams: 'LastParams',
  Telefones: 'Telefones'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
