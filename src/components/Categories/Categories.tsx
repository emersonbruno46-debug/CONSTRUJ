import React from 'react';
import {
  Layers,
  Paintbrush,
  Wrench,
  Droplets,
  Zap,
  Building2
} from 'lucide-react';
import { categoriesData } from '../../data/categories';
import { ProductCategory } from '../../types/catalog';
import './Categories.css';

interface CategoriesProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const getCategoryIcon = (id: ProductCategory) => {
    switch (id) {
      case 'pisos':
        return <Layers size={36} aria-hidden="true" />;
      case 'tintas':
        return <Paintbrush size={36} aria-hidden="true" />;
      case 'ferramentas':
        return <Wrench size={36} aria-hidden="true" />;
      case 'hidraulica':
        return <Droplets size={36} aria-hidden="true" />;
      case 'eletrica':
        return <Zap size={36} aria-hidden="true" />;
      case 'basicos':
        return <Building2 size={36} aria-hidden="true" />;
      default:
        return <Layers size={36} aria-hidden="true" />;
    }
  };

  return (
    <section className="categories-section" aria-labelledby="categories-heading">
      <div className="container">
        <div className="categories-header-row">
          <div>
            <h2 id="categories-heading" className="categories-title">
              O que sua obra precisa
            </h2>
          </div>
          <div className="categories-subtitle">
            Qualidade e variedade para todas as etapas da sua obra.
          </div>
        </div>

        <div className="categories-grid">
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="category-card"
              onClick={() => onSelectCategory(cat.id)}
              aria-label={`Ver produtos da categoria ${cat.nome}`}
            >
              <div className="category-image-container">
                <div className="category-icon-fallback">
                  {getCategoryIcon(cat.id)}
                </div>
              </div>
              <span className="category-name">{cat.nome}</span>
            </button>
          ))}
        </div>

        <div className="categories-footnote">
          Referência visual • categorias a confirmar com a loja
        </div>
      </div>
    </section>
  );
};
