import React from 'react';
import { Plus, Check } from 'lucide-react';
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
  const hasVariants = Boolean(product.variantes && product.variantes.length > 0);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVariants) {
      // Se tem variantes obrigatórias, abre o modal para o cliente escolher
      onOpenDetails(product);
    } else {
      onQuickAdd(product);
    }
  };

  return (
    <article className="product-card" aria-labelledby={`prod-title-${product.id}`}>
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
          width="260"
          height="260"
          onError={(e) => {
            // Imagem fallback elegante caso arquivo não exista
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
            className="btn-add-quote"
            onClick={handleAddClick}
            aria-label={`Adicionar ${product.nome} ao orçamento`}
          >
            {isAdded ? (
              <>
                <Check size={16} />
                <span>Adicionado à lista</span>
              </>
            ) : (
              <>
                <Plus size={16} />
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
    </article>
  );
};
