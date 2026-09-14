import React from 'react';
import { Search, X, Layers, Paintbrush, Wrench, Droplets, Zap, Building2, LayoutGrid } from 'lucide-react';
import { ProductCategory } from '../../types/catalog';
import { categoriesData } from '../../data/categories';

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

  const hasActiveFilters = searchTerm.trim() !== '' || selectedCategory !== 'all';

  return (
    <div className="catalog-controls">
      {/* Input de Busca com debounce visual e botão de limpar */}
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

      {/* Chips de Categorias */}
      <div className="category-chips-row" role="tablist" aria-label="Filtrar por categoria">
        <button
          type="button"
          className={`chip-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
          role="tab"
          aria-selected={selectedCategory === 'all'}
        >
          {getCategoryIcon('all')}
          <span>Todos</span>
        </button>

        {categoriesData.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`chip-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
            role="tab"
            aria-selected={selectedCategory === cat.id}
          >
            {getCategoryIcon(cat.id)}
            <span>{cat.nome}</span>
          </button>
        ))}
      </div>

      {/* Status de Resultados */}
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
