import React from 'react';
import { Plus, Check, SlidersHorizontal } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Product } from '../../types/catalog';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  isAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAdd,
  isAdded
}) => {
  const shouldReduceMotion = useReducedMotion();
  const hasVariants = Boolean(product.variantes && product.variantes.length > 0);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVariants) {
      // Se tem variantes obrigatórias, abre o modal de detalhes para o cliente selecionar
      onOpenDetails(product);
    } else {
      onQuickAdd(product);
    }
  };

  const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <motion.article
      className="product-card"
      aria-labelledby={`prod-title-${product.id}`}
      layout={!shouldReduceMotion}
      initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: EASE_CUBIC }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
    >
      {product.demonstrativo && (
        <span className="product-card-badge">Catálogo ilustrativo</span>
      )}

      <div
        className="product-image-container"
        onClick={() => onOpenDetails(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenDetails(product);
          }
        }}
        aria-label={`Ver detalhes de ${product.nome}`}
      >
        <img
          src={product.imagem}
          alt={product.alt || product.nome}
          loading="lazy"
          decoding="async"
          width="260"
          height="260"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      <div className="product-body">
        <div className="product-code-category">
          <span>{product.codigo}</span>
          <span>{product.categoriaNome}</span>
        </div>

        <h3
          id={`prod-title-${product.id}`}
          className="product-title"
          onClick={() => onOpenDetails(product)}
        >
          {product.nome}
        </h3>

        <div className="product-subtitle">
          {hasVariants ? `Consulte opções (${product.variantes?.length} variantes)` : 'Consulte opções'}
        </div>

        <div className="product-card-footer">
          <button
            type="button"
            className={`btn-add-quote ${isAdded ? 'added' : ''}`}
            onClick={handleAddClick}
            aria-label={
              isAdded
                ? `${product.nome} adicionado ao orçamento`
                : hasVariants
                ? `Escolher opções para ${product.nome}`
                : `Adicionar ${product.nome} ao orçamento`
            }
          >
            {isAdded ? (
              <>
                <Check size={16} aria-hidden="true" />
                <span>Adicionado</span>
              </>
            ) : hasVariants ? (
              <>
                <SlidersHorizontal size={16} aria-hidden="true" />
                <span>Escolher opções</span>
              </>
            ) : (
              <>
                <Plus size={16} aria-hidden="true" />
                <span>Adicionar ao orçamento</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-view-details"
            onClick={() => onOpenDetails(product)}
          >
            Ver detalhes e especificações
          </button>
        </div>
      </div>
    </motion.article>
  );
};
