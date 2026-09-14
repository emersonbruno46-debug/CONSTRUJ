import React from 'react';
import {
  Layers,
  Paintbrush,
  Wrench,
  Droplets,
  Zap,
  Building2
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { categoriesData } from '../../data/categories';
import { ProductCategory } from '../../types/catalog';
import { ConstruJReveal } from '../Motion/ConstruJReveal';
import './Categories.css';

interface CategoriesProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const shouldReduceMotion = useReducedMotion();

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
        <ConstruJReveal yOffset={10}>
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
        </ConstruJReveal>

        <div className="categories-grid">
          {categoriesData.map((cat, index) => {
            const delay = Math.min(index * 0.045, 0.225);

            if (shouldReduceMotion) {
              return (
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
              );
            }

            return (
              <motion.button
                key={cat.id}
                type="button"
                className="category-card"
                onClick={() => onSelectCategory(cat.id)}
                aria-label={`Ver produtos da categoria ${cat.nome}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.38,
                  delay,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="category-image-container">
                  <div className="category-icon-fallback">
                    {getCategoryIcon(cat.id)}
                  </div>
                </div>
                <span className="category-name">{cat.nome}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="categories-footnote">
          Referência visual • categorias a confirmar com a loja
        </div>
      </div>
    </section>
  );
};
