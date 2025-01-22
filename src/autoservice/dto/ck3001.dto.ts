import { IsString, IsNumber, IsDecimal, IsDate, IsOptional } from 'class-validator';

export class Ck3001Dto {
  @IsString()
  numero_do_dn: string;

  @IsString()
  numero_da_nota_fiscal: string;

  @IsString()
  serie_da_nota_fiscal: string;

  @IsNumber()
  fonte_pagadora: number;

  @IsDecimal()
  valor_total_liquido_das_pecas_na_nota_fiscal: number;

  @IsString()
  indicador: string;

  @IsDate()
  data_e_hora_da_emissao_da_nota_fiscal: Date;

  @IsString()
  numero: string;

  @IsString()
  endereco: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  nome_do_cliente: string;

  @IsString()
  cpf_cnpj: string;
}
