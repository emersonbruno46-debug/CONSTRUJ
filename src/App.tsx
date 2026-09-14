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
import { useQuote } from './hooks/useQuote';
import { ProductCategory, Product, ProductVariant } from './types/catalog';
import { companyData } from './data/company';

export const App: React.FC = () => {
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
    window.open(companyData.whatsapp.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Link para pular direto para o conteúdo via teclado */}
      <a href="#catalogo" className="skip-link">
        Pular para o catálogo de materiais
      </a>

      {/* Cabeçalho */}
      <Header
        quoteCount={totalDistinctItems}
        onOpenQuote={() => setIsQuoteOpen(true)}
        activeSection={activeSection}
      />

      <main>
        {/* Abertura / Hero */}
        <Hero
          onExploreCatalog={handleExploreCatalog}
          onOpenQuoteWhatsApp={handleOpenQuoteWhatsApp}
        />

        {/* 6 Categorias Oficiais */}
        <Categories onSelectCategory={handleSelectCategoryFromHero} />

        {/* Catálogo Interativo com Busca e Filtros */}
        <Catalog
          onAddToQuote={handleAddToQuote}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Nossa Loja e Galeria Real */}
        <StoreSection />

        {/* Contato, Horários, Endereço e Como Chegar */}
        <ContactSection onOpenQuote={() => setIsQuoteOpen(true)} />
      </main>

      {/* Rodapé Institucional */}
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
