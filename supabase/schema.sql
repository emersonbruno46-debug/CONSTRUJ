-- ==========================================================
-- CONSTRU-J: ESQUEMA DE BANCO DE DADOS SUPABASE (POSTGRESQL)
-- ==========================================================

-- Habilita extensão de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  imagem TEXT,
  icone TEXT DEFAULT 'Building2',
  thiing_id TEXT,
  ativo BOOLEAN DEFAULT true,
  show_on_home BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  categoria_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  categoria_nome TEXT NOT NULL,
  descricao TEXT,
  unidade TEXT DEFAULT 'un',
  permite_decimal BOOLEAN DEFAULT false,
  quantidade_minima NUMERIC DEFAULT 1,
  incremento NUMERIC DEFAULT 1,
  imagem TEXT NOT NULL,
  alt TEXT,
  marca TEXT,
  variantes JSONB DEFAULT '[]'::jsonb,
  especificacoes JSONB DEFAULT '[]'::jsonb,
  fotos_adicionais JSONB DEFAULT '[]'::jsonb,
  demonstrativo BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'hidden')),
  ativo BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_categoria ON public.products(categoria_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_codigo ON public.products(codigo);

-- 3. TABELA DE CONFIGURAÇÕES DA LOJA
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'config_default',
  nome TEXT NOT NULL DEFAULT 'Constru J',
  slogan TEXT DEFAULT 'A mais completa e preferida',
  cidade TEXT DEFAULT 'Rio Pardo de Minas',
  estado TEXT DEFAULT 'MG',
  telefone TEXT,
  whatsapp JSONB,
  horarios JSONB,
  pagamento_no_atendimento JSONB,
  endereco JSONB,
  mapa_link TEXT,
  instagram TEXT,
  instagram_url TEXT,
  quote_initial_message TEXT,
  announcement_banner JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE APARÊNCIA DO SITE
CREATE TABLE IF NOT EXISTS public.site_appearance (
  id TEXT PRIMARY KEY DEFAULT 'appearance_default',
  hero_eyebrow TEXT DEFAULT 'CONSTRU-J',
  hero_headline TEXT,
  hero_subtitle TEXT,
  hero_btn_primary_text TEXT DEFAULT 'Explorar produtos',
  hero_btn_secondary_text TEXT DEFAULT 'Pedir orçamento',
  hero_facade_image TEXT,
  featured_product_ids JSONB DEFAULT '[]'::jsonb,
  gallery_photos JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- 5. TABELA DE EQUIPE ADMINISTRATIVA
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  papel TEXT NOT NULL CHECK (papel IN ('admin', 'editor')),
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  ultimo_acesso TIMESTAMPTZ
);

-- 6. TABELA DE AUDITORIA E LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  autor_email TEXT NOT NULL,
  autor_nome TEXT NOT NULL,
  acao TEXT NOT NULL,
  entidade TEXT NOT NULL,
  entidade_id TEXT,
  entidade_nome TEXT,
  data_hora TIMESTAMPTZ DEFAULT NOW(),
  detalhes TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_data ON public.audit_logs(data_hora DESC);

-- ==========================================================
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==========================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_appearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Visitantes públicos só lêem produtos publicados e categorias ativas
CREATE POLICY "Public read published products" ON public.products
  FOR SELECT USING (status = 'published' AND ativo = true AND deleted_at IS NULL);

CREATE POLICY "Public read active categories" ON public.categories
  FOR SELECT USING (ativo = true);

CREATE POLICY "Public read store settings" ON public.store_settings
  FOR SELECT USING (true);

CREATE POLICY "Public read appearance" ON public.site_appearance
  FOR SELECT USING (true);

-- Usuários autenticados têm acesso total de leitura e escrita
CREATE POLICY "Admin full access products" ON public.products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access categories" ON public.categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access store settings" ON public.store_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access appearance" ON public.site_appearance
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access users" ON public.admin_users
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access audit" ON public.audit_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================================
-- BUCKET DE ARMAZENAMENTO PARA FOTOS
-- ==========================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('construj-media', 'construj-media', true);
-- CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'construj-media');
-- CREATE POLICY "Auth upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'construj-media');
