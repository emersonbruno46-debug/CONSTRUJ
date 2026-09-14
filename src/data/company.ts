import { CompanyInfo } from '../types/company';

export const companyData: CompanyInfo = {
  nome: 'Constru J',
  slogan: 'A mais completa e preferida',
  cidade: 'Rio Pardo de Minas',
  estado: 'MG',
  whatsapp: {
    exibicao: '(38) 99121-4662',
    internacional: '5538991214662',
    numeroLimpo: '38991214662',
    link: 'https://wa.me/5538991214662'
  },
  telefone: '(38) 99121-4662',
  horarios: {
    segundaASexta: '07:00 às 17:00',
    sabado: '07:00 às 12:00',
    domingo: 'Fechado'
  },
  pagamentoNoAtendimento: [
    'Dinheiro',
    'Pix',
    'Cartão de crédito',
    'Cartão de débito'
  ],
  endereco: {
    logradouro: 'Rua Tácito de Freitas Costa',
    numero: '414',
    bairro: 'Cidade Alta',
    cidade: 'Rio Pardo de Minas',
    estado: 'MG',
    cep: '39530-000',
    completo: 'Rua Tácito de Freitas Costa, 414 — Cidade Alta, Rio Pardo de Minas – MG, CEP 39530-000',
    notaBairro: 'Grafia "Cidade Alta" baseada no registro do mapa local; a confirmar formalmente com a loja.'
  },
  mapaLink: 'https://maps.app.goo.gl/6NhojCjPtRqPegwD8?g_st=ic',
  instagram: '@construj_',
  instagramUrl: 'https://instagram.com/construj_'
};
