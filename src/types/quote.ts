import { Product, ProductVariant } from './catalog';

export interface QuoteItem {
  id: string; // chave única combinando productId + variantId
  productId: string;
  produto: Product;
  variante?: ProductVariant;
  quantidade: number;
}

export interface QuoteState {
  version: number;
  items: QuoteItem[];
  observacoes: string;
}
