import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Layers, Paintbrush, Wrench, Droplets, Zap, Building2, LayoutGrid } from 'lucide-react';
import { ProductCategory } from '../../types/catalog';
import { categoriesData } from '../../data/categories';

interface ConstruJCategoryFiltersProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
}

export const ConstruJCategoryFilters: React.FC<ConstruJCategoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const shouldReduceMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  const getCategoryIcon = (catId: ProductCategory | 'all') => {
    switch (catId) {
      case 'all':
        return <LayoutGrid size={16} aria-hidden="true" />;
      case 'pisos':
        return <Layers size={16} aria-hidden="true" />;
      case 'tintas':
        return <Paintbrush size={16} aria-hidden="true" />;
      case 'ferramentas':
        return <Wrench size={16} aria-hidden="true" />;
      case 'hidraulica':
        return <Droplets size={16} aria-hidden="true" />;
      case 'eletrica':
        return <Zap size={16} aria-hidden="true" />;
      case 'basicos':
        return <Building2 size={16} aria-hidden="true" />;
      default:
        return null;
    }
  };

  // Keep active pill in view on horizontal scroll without vertical scrolling
  useEffect(() => {
    if (activeBtnRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const btn = activeBtnRef.current;

      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.clientWidth;
      const btnLeft = btn.offsetLeft;
      const btnRight = btnLeft + btn.clientWidth;

      if (btnLeft < containerLeft || btnRight > containerRight) {
        btn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedCategory]);

  return (
    <div className="category-chips-container">
      <div
        ref={scrollContainerRef}
        className="category-chips-scroll"
        role="group"
        aria-label="Filtrar produtos por categoria"
      >
        {/* Opção Todos */}
        {/* Opção Todos */}
        <button
          ref={selectedCategory === 'all' ? activeBtnRef : null}
          type="button"
          className={`chip-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
          aria-pressed={selectedCategory === 'all'}
        >
          {selectedCategory === 'all' && (
            shouldReduceMotion ? (
              <span className="chip-pill-background" aria-hidden="true" />
            ) : (
              <motion.span
                className="chip-pill-background"
                layoutId="active-category-pill"
                transition={{
                  duration: 0.22,
                  ease: [0.22, 1, 0.36, 1]
                }}
                aria-hidden="true"
              />
            )
          )}
          <span className="chip-content">
            {getCategoryIcon('all')}
            <span>Todos</span>
          </span>
        </button>

        {/* Categorias Oficiais */}
        {categoriesData.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              ref={isActive ? activeBtnRef : null}
              type="button"
              className={`chip-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              aria-pressed={isActive}
            >
              {isActive && (
                shouldReduceMotion ? (
                  <span className="chip-pill-background" aria-hidden="true" />
                ) : (
                  <motion.span
                    className="chip-pill-background"
                    layoutId="active-category-pill"
                    transition={{
                      duration: 0.22,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    aria-hidden="true"
                  />
                )
              )}
              <span className="chip-content">
                {getCategoryIcon(cat.id)}
                <span>{cat.nome}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="category-scroll-indicator" aria-hidden="true" />
    </div>
  );
};
