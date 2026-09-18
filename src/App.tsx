import React, { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { Categories } from './components/Categories/Categories';
import { Catalog } from './components/Catalog/Catalog';
import { StoreSection } from './components/StoreSection/StoreSection';
import { ContactSection } from './components/ContactSection/ContactSection';
import { Footer } from './components/Footer/Footer';
import { QuoteDrawer } from './components/QuoteDrawer/QuoteDrawer';
import { ConstruJFloatingBar } from './components/QuoteDrawer/ConstruJFloatingBar';
import { Toast } from './components/UI/Toast';
import { CustomCursor } from './components/UI/CustomCursor';
import { useQuote } from './hooks/useQuote';
import { ProductCategory, Product, ProductVariant, CategoryInfo } from './types/catalog';
import { companyData } from './data/company';
import {
  getProducts,
  getCategories,
  getStoreSettings,
  subscribeToDataChanges
} from './services/db';
import { StoreSettingsAdmin } from './types/admin';

// Carregamento dinâmico sob demanda (code splitting) para não sobrecarregar visitantes do site público
const AdminRoot = React.lazy(() =>
  import('./admin/AdminRoot').then((module) => ({ default: module.AdminRoot }))
);

export const App: React.FC = () => {
  // Controle de rota pública vs painel administrativo (suporta tanto path direto /admin quanto hash #/admin)
  const isCurrentlyAdmin = () => {
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.pathname.includes('/admin') ||
      window.location.hash.startsWith('#/admin') ||
      window.location.hash.startsWith('#admin') ||
      window.location.hash.includes('admin')
    );
  };

  const [isAdminRoute, setIsAdminRoute] = useState(isCurrentlyAdmin);

  // Dados reativos carregados da base persistente
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [liveCategories, setLiveCategories] = useState<CategoryInfo[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettingsAdmin | null>(null);

  // Orçamento
  const {
    items,
    observacoes,
    setObservacoes,
    addItem,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearQuote,
    totalDistinctItems,
    whatsAppUrl
  } = useQuote();

  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Monitora alterações de URL (botões de voltar/avançar, hashchange e links)
  useEffect(() => {
    const checkRoute = () => {
      setIsAdminRoute(isCurrentlyAdmin());
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Controla a classe 'admin-mode' no <body> para que os cursores nativos (seta, ponteiro) funcionem normalmente no painel
  useEffect(() => {
    if (isAdminRoute) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }, [isAdminRoute]);

  // Carrega e sincroniza dados do banco de dados persistente
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prods, cats, settings] = await Promise.all([
          getProducts(false), // somente publicados para o visitante público
          getCategories(false), // somente ativas
          getStoreSettings()
        ]);
        setLiveProducts(prods as unknown as Product[]);
        setLiveCategories(cats as unknown as CategoryInfo[]);
        setStoreSettings(settings);
      } catch (err) {
        console.error('Erro ao carregar dados do banco:', err);
      }
    };

    loadData();

    // Inscreve para atualizar imediatamente quando houver alterações no admin
    const unsubscribe = subscribeToDataChanges(() => {
      loadData();
    });

    return () => unsubscribe();
  }, []);

  // Monitora modais abertos no DOM para ocultar a barra flutuante
  useEffect(() => {
    const checkModal = () => {
      setIsModalOpen(document.body.classList.contains('modal-open'));
    };
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Adiciona espaçamento inferior no mobile quando a barra flutuante estiver ativa
  useEffect(() => {
    const hasFloating = totalDistinctItems > 0 && !isQuoteOpen && !isModalOpen;
    document.body.classList.toggle('has-floating-bar', hasFloating);
    return () => {
      document.body.classList.remove('has-floating-bar');
    };
  }, [totalDistinctItems, isQuoteOpen, isModalOpen]);

  // Track scroll position to highlight active navigation link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'catalogo', 'loja', 'contato'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExploreCatalog = () => {
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryFromHero = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    handleExploreCatalog();
  };

  const handleAddToQuote = (
    product: Product,
    variant?: ProductVariant,
    quantity?: number
  ) => {
    addItem(product, variant, quantity);
    const variantLabel = variant ? ` (${variant.nome})` : '';
    setToastMessage(`"${product.nome}${variantLabel}" adicionado ao seu orçamento!`);
  };

  const handleOpenQuoteWhatsApp = () => {
    const link = storeSettings?.whatsapp?.link || companyData.whatsapp.link;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // Se a rota for o painel administrativo, renderiza o AdminRoot completo sob demanda
  if (isAdminRoute) {
    return (
      <React.Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              height: '100vh',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0a3215',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 600,
              gap: '12px'
            }}
          >
            Carregando painel administrativo...
          </div>
        }
      >
        <AdminRoot />
      </React.Suspense>
    );
  }

  // Verifica se o aviso temporário está ativo e no período válido
  const banner = storeSettings?.announcementBanner;
  let showAnnouncement = false;
  if (banner && banner.ativo && banner.texto?.trim()) {
    const now = new Date().getTime();
    const startOk = !banner.inicio || new Date(banner.inicio).getTime() <= now;
    const endOk = !banner.termino || new Date(banner.termino).getTime() >= now;
    showAnnouncement = startOk && endOk;
  }

  return (
    <>
      {/* Cursor Personalizado Moderno com Ponto, Glow e Rastro */}
      <CustomCursor />

      {/* Link para pular direto para o conteúdo via teclado */}
      <a href="#catalogo" className="skip-link">
        Pular para o catálogo de materiais
      </a>

      {/* Faixa de Aviso Temporário (se ativa) */}
      {showAnnouncement && banner && (
        <div
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: '#ff7100',
            color: '#ffffff',
            padding: '8px 16px',
            textAlign: 'center',
            fontSize: '0.86rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            zIndex: 100
          }}
        >
          <span>{banner.texto}</span>
          {banner.link && (
            <a
              href={banner.link}
              style={{
                textDecoration: 'underline',
                color: '#ffffff',
                fontWeight: 800,
                marginLeft: '6px'
              }}
            >
              {banner.linkTexto || 'Saiba mais →'}
            </a>
          )}
        </div>
      )}

      {/* Cabeçalho */}
      <Header
        quoteCount={totalDistinctItems}
        onOpenQuote={() => setIsQuoteOpen(true)}
        activeSection={activeSection}
      />

      <main>
        {/* Abertura / Hero com layout amplo e espaçado */}
        <Hero
          onExploreCatalog={handleExploreCatalog}
          onOpenQuoteWhatsApp={handleOpenQuoteWhatsApp}
          onSelectCategory={handleSelectCategoryFromHero}
        />

        {/* 6 Categorias com grid responsivo ampliado */}
        <Categories
          onSelectCategory={handleSelectCategoryFromHero}
          categories={liveCategories.length > 0 ? liveCategories : undefined}
        />

        {/* Catálogo Interativo conectado à base persistente */}
        <Catalog
          onAddToQuote={handleAddToQuote}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          products={liveProducts.length > 0 ? liveProducts : undefined}
        />

        {/* Nossa Loja e Galeria Real */}
        <StoreSection />

        {/* Contato, Horários, Endereço e Como Chegar */}
        <ContactSection onOpenQuote={() => setIsQuoteOpen(true)} />
      </main>

      {/* Rodapé Institucional com Link de Acesso ao Painel */}
      <Footer />

      {/* Barra Flutuante Mobile de Meu Orçamento */}
      <ConstruJFloatingBar
        itemCount={totalDistinctItems}
        isOpen={isQuoteOpen}
        isAnyModalOpen={isModalOpen}
        onOpen={() => setIsQuoteOpen(true)}
      />

      {/* Gaveta / Modal de Meu Orçamento */}
      <QuoteDrawer
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        items={items}
        observacoes={observacoes}
        onObservacoesChange={setObservacoes}
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
        onRemove={removeItem}
        onClearQuote={clearQuote}
        whatsAppUrl={whatsAppUrl}
        onShowToast={setToastMessage}
      />

      {/* Toast de Notificação */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </>
  );
};
