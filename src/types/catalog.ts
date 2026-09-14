export type ProductCategory =
  | 'pisos'
  | 'tintas'
  | 'ferramentas'
  | 'hidraulica'
  | 'eletrica'
  | 'basicos';

export interface ProductVariant {
  id: string;
  nome: string;
  detalhe?: string;
}

export interface Product {
  id: string;
  codigo: string;
  nome: string;
  categoria: ProductCategory;
  categoriaNome: string;
  descricao: string;
  unidade: string; // 'un', 'm²', 'sc', 'cx', 'm', 'kg', 'lata'
  permiteDecimal: boolean;
  quantidadeMinima: number;
  incremento: number;
  imagem: string;
  alt: string;
  marca?: string;
  variantes?: ProductVariant[];
  especificacoes?: { chave: string; valor: string }[];
  demonstrativo: boolean;
  ativo: boolean;
  oferta?: {
    descricao: string;
    condicoes?: string;
    validade?: string;
  };
}

export interface CategoryInfo {
  id: ProductCategory;
  nome: string;
  descricao: string;
  imagem: string;
  icone: string;
}
