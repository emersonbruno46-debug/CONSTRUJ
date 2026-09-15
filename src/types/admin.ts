import { Product, ProductCategory, CategoryInfo } from './catalog';
import { CompanyInfo } from './company';

export type UserRole = 'admin' | 'editor';

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  papel: UserRole;
  ativo: boolean;
  criadoEm: string;
  ultimoAcesso?: string;
  avatarUrl?: string;
}

export type ProductStatus = 'published' | 'draft' | 'hidden';

export interface AdditionalPhoto {
  id: string;
  url: string;
  legenda?: string;
  alt?: string;
  ordem: number;
}

export interface ProductAdmin extends Omit<Product, 'categoria'> {
  categoria: ProductCategory | string;
  status: ProductStatus;
  isFeatured?: boolean;
  deletedAt?: string; // Para exclusão recuperável (soft delete)
  fotosAdicionais?: AdditionalPhoto[];
  updatedAt?: string;
  updatedBy?: string;
  createdAt?: string;
}

export interface CategoryAdmin extends Omit<CategoryInfo, 'id'> {
  id: string;
  ativo: boolean;
  showOnHome: boolean;
  ordem: number;
  deletedAt?: string;
}

export interface AnnouncementBanner {
  ativo: boolean;
  texto: string;
  link?: string;
  linkTexto?: string;
  inicio?: string; // ISO date
  termino?: string; // ISO date
}

export interface StoreSettingsAdmin extends CompanyInfo {
  quoteInitialMessage: string;
  announcementBanner?: AnnouncementBanner;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  titulo: string;
  legenda?: string;
  alt: string;
  ordem: number;
}

export interface SiteAppearanceAdmin {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroBtnPrimaryText: string;
  heroBtnSecondaryText: string;
  heroFacadeImage: string;
  featuredProductIds: string[];
  galleryPhotos: GalleryPhoto[];
  updatedAt?: string;
  updatedBy?: string;
}

export interface AuditLogEntry {
  id: string;
  autorEmail: string;
  autorNome: string;
  acao: string;
  entidade: 'produto' | 'categoria' | 'loja' | 'aparencia' | 'equipe';
  entidadeId?: string;
  entidadeNome?: string;
  dataHora: string;
  detalhes?: string;
}
