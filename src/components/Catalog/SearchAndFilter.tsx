import React from 'react';
import { Search, X } from 'lucide-react';
import { ProductCategory } from '../../types/catalog';
import { ConstruJCategoryFilters } from './ConstruJCategoryFilters';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  totalResults: number;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalResults
}) => {
  const hasActiveFilters = searchTerm.trim() !== '' || selectedCategory !== 'all';

  return (
    <div className="catalog-controls">
      {/* Input de Busca com botão de limpar */}
      <div className="search-input-wrapper">
        <Search size={20} className="search-icon" aria-hidden="true" />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por produto, código, categoria ou marca..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar produtos no catálogo"
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Limpar campo de busca"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Chips de Categorias com Cápsula Deslizante */}
      <ConstruJCategoryFilters
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Status de Resultados com Fade Suave */}
      <div className="catalog-status-bar" aria-live="polite">
        <span>
          {totalResults === 1
            ? '1 produto encontrado'
            : `${totalResults} produtos encontrados`}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filter-link"
            onClick={() => {
              onSearchChange('');
              onSelectCategory('all');
            }}
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
};
