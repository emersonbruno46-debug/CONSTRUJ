import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { SearchAndFilter } from './SearchAndFilter';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { Product, ProductCategory, ProductVariant } from '../../types/catalog';
import { productsData } from '../../data/products';
import { matchesSearch } from '../../utils/normalize';
import { PackageOpen, MessageCircle } from 'lucide-react';
import { companyData } from '../../data/company';
import { ConstruJReveal } from '../Motion/ConstruJReveal';
import './Catalog.css';

interface CatalogProps {
  onAddToQuote: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  onAddToQuote,
  selectedCategory,
  onSelectCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Filtragem combinada por busca e categoria
  const filteredProducts = useMemo(() => {
    return productsData.filter((prod) => {
      if (!prod.ativo) return false;

      // Filtro de categoria
      if (selectedCategory !== 'all' && prod.categoria !== selectedCategory) {
        return false;
      }

      // Filtro de texto (nome, código, marca, categoriaNome, especificações)
      if (searchTerm.trim()) {
        const matchName = matchesSearch(prod.nome, searchTerm);
        const matchCode = matchesSearch(prod.codigo, searchTerm);
        const matchCat = matchesSearch(prod.categoriaNome, searchTerm);
        const matchBrand = prod.marca ? matchesSearch(prod.marca, searchTerm) : false;

        return matchName || matchCode || matchCat || matchBrand;
      }

      return true;
    });
  }, [searchTerm, selectedCategory]);

  const handleQuickAdd = (product: Product) => {
    onAddToQuote(product);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1200);
  };

  return (
    <section id="catalogo" className="catalog-section" aria-labelledby="catalog-title">
      <div className="container">
        {/* Cabeçalho do Catálogo com Reveal na primeira aparição */}
        <ConstruJReveal yOffset={10}>
          <div className="catalog-header">
            <div className="catalog-header-top">
              <div>
                <span className="section-eyebrow">Catálogo Completo</span>
                <h2 id="catalog-title" className="section-title">
                  Encontre o material certo para sua obra
                </h2>
                <p className="section-subtitle">
                  Qualidade, variedade e o suporte que você precisa, do início ao acabamento.
                </p>
              </div>

              <div className="catalog-sticker" aria-hidden="true">
                Sua obra mais forte começa aqui
              </div>
            </div>

            {/* Barra de Busca e Filtros */}
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              totalResults={filteredProducts.length}
            />
          </div>
        </ConstruJReveal>

        {/* Grid de Produtos com layout coordenado sem remontar toda a grade */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={setSelectedProductForModal}
                  onQuickAdd={handleQuickAdd}
                  isAdded={recentlyAddedId === product.id}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Estado Vazio */
          <div className="catalog-empty-state">
            <PackageOpen size={48} aria-hidden="true" />
            <h3 className="catalog-empty-title">Nenhum produto encontrado</h3>
            <p className="catalog-empty-desc">
              Não encontramos nenhum item correspondente aos seus filtros. Experimente buscar por outro termo ou fale direto com nossa equipe.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  onSelectCategory('all');
                }}
              >
                Ver todos os produtos
              </button>
              <a
                href={companyData.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <MessageCircle size={18} />
                <span>Consultar no WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Nota de transparência do catálogo */}
        <div style={{ textAlign: 'center', marginTop: '36px', fontSize: '13px', color: 'var(--color-text-light)' }}>
          Produtos ilustrativos para montagem do orçamento — disponibilidade, marcas e especificações confirmadas no atendimento pela equipe da Constru J.
        </div>
      </div>

      {/* Modal de Detalhes do Produto */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToQuote={onAddToQuote}
      />
    </section>
  );
};
