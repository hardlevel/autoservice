import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Inserindo dados no modelo `cki_fontes_pagadoras`
    await prisma.tb_cki_fontes_pagadoras.createMany({
        data: [
            {
                id: 1,
                desc_fonte_pagadora: 'Cliente',
                obs_fonte_pagadora: 'Vendas de Peças, Acessórios e Serviços para clientes PF e PJ, exceto revisões, promoções e Seguro'
            },
            {
                id: 2,
                desc_fonte_pagadora: 'Internos',
                obs_fonte_pagadora: 'Serviços executados nos veículos de propriedade do DN'
            },
            {
                id: 3,
                desc_fonte_pagadora: 'Usados',
                obs_fonte_pagadora: 'Serviços de manutenção e revisão realizados em veículos usados ou de troca na venda de um zero km'
            },
            {
                id: 4,
                desc_fonte_pagadora: 'Lojas de Peças',
                obs_fonte_pagadora: 'Vendas de peças e acessórios para lojistas'
            },
            {
                id: 5,
                desc_fonte_pagadora: 'Governo',
                obs_fonte_pagadora: 'Vendas de peças e acessórios ou serviços realizados para clientes Governo / Licitações'
            },
            {
                id: 6,
                desc_fonte_pagadora: 'n/a',
                obs_fonte_pagadora: 'desconhecido'
            },
            {
                id: 7,
                desc_fonte_pagadora: 'Oficinas Independentes',
                obs_fonte_pagadora: 'Vendas de peças e acessórios ou serviços realizados para oficinas independentes'
            },
            {
                id: 8,
                desc_fonte_pagadora: 'Garantia',
                obs_fonte_pagadora: 'Serviços realizados em garantia, exceto 1a revisão (Usar fonte 14 para 1o Revisão e Revisões de série)'
            },
            {
                id: 9,
                desc_fonte_pagadora: 'Concessionárias da Rede',
                obs_fonte_pagadora: 'Vendas de peças e acessórios ou serviços realizados para outras concessionárias da rede'
            },
            {
                id: 10,
                desc_fonte_pagadora: 'Seguro',
                obs_fonte_pagadora: 'Vendas de Peças e Acessórios ou Serviços realizados para empresas de seguros'
            },
            {
                id: 11,
                desc_fonte_pagadora: 'Promoções',
                obs_fonte_pagadora: 'Promoções de vendas de peças e acessórios ou serviços'
            },
            {
                id: 12,
                desc_fonte_pagadora: 'Não informado',
                obs_fonte_pagadora: 'desconhecido'
            },
            {
                id: 13,
                desc_fonte_pagadora: 'Revisão de Entrega',
                obs_fonte_pagadora: 'Revisão de entrega do veículo novo, revisão interna do DN antes da entrega para o Cliente'
            },
            {
                id: 14,
                desc_fonte_pagadora: 'Revisão Garantia/Série',
                obs_fonte_pagadora: 'Mão de obra da primeira revisão do Veículo / Revisão de Série'
            },
            {
                id: 15,
                desc_fonte_pagadora: 'Revisão Normal',
                obs_fonte_pagadora: 'Demais Revisões pagas pelo cliente e itens obrigatórios da revisão'
            },
            {
                id: 16,
                desc_fonte_pagadora: 'Frotista / Locadoras / Contratos',
                obs_fonte_pagadora: 'Serviços realizados para clientes Frotistas, locadoras de veículos, contratos ou comodatos (desde que não sejam Governo ou CPF)'
            },
            {
                id: 17,
                desc_fonte_pagadora: 'E-Commerce',
                obs_fonte_pagadora: 'Venda Online ou através da loja virtual VW'
            },
        ],
        skipDuplicates: true
    });

    console.log('Seed de dados inserido com sucesso!');
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
