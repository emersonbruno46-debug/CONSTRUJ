export interface CompanyInfo {
  nome: string;
  slogan: string;
  cidade: string;
  estado: string;
  whatsapp: {
    exibicao: string;
    internacional: string;
    numeroLimpo: string;
    link: string;
  };
  telefone: string;
  horarios: {
    segundaASexta: string;
    sabado: string;
    domingo: string;
  };
  pagamentoNoAtendimento: string[];
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    completo: string;
    notaBairro: string;
  };
  mapaLink: string;
  instagram: string;
  instagramUrl: string;
}
