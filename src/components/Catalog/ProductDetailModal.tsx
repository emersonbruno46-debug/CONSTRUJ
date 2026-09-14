import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus, Check, FileText } from 'lucide-react';
import { Product, ProductVariant } from '../../types/catalog';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToQuote: (product: Product, variant?: ProductVariant, quantity?: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToQuote
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedRecently, setAddedRecently] = useState(false);

  // Set initial state when product opens
  useEffect(() => {
    if (product) {
      const defaultVariant = product.variantes && product.variantes.length > 0 ? product.variantes[0] : undefined;
      setSelectedVariant(defaultVariant);
      setQuantity(product.quantidadeMinima || 1);
      setAddedRecently(false);
      document.body.classList.add('modal-open');

      // Focus close button on open
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [product]);

  // Handle keyboard: Escape closes, trap Tab focus
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleIncrement = () => {
    const inc = product.incremento || 1;
    setQuantity((prev) => Number((prev + inc).toFixed(2)));
  };

  const handleDecrement = () => {
    const inc = product.incremento || 1;
    const min = product.quantidadeMinima || 1;
    setQuantity((prev) => {
      const next = Number((prev - inc).toFixed(2));
      return next >= min ? next : prev;
    });
  };

  const handleAdd = () => {
    onAddToQuote(product, selectedVariant, quantity);
    setAddedRecently(true);
    setTimeout(() => {
      setAddedRecently(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="product-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="product-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="product-modal-close-btn"
          onClick={onClose}
          aria-label="Fechar modal de detalhes"
        >
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Imagem do Produto */}
          <div className="product-modal-image-col">
            <img
              src={product.imagem}
              alt={product.alt || product.nome}
              width="360"
              height="360"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Informações e Ações */}
          <div className="product-modal-info">
            <div className="product-modal-code">
              Código: {product.codigo} • {product.categoriaNome}
            </div>

            <h2 id="modal-product-title" className="product-modal-title">
              {product.nome}
            </h2>

            <p className="product-modal-desc">{product.descricao}</p>

            {/* Variantes (se houver) */}
            {product.variantes && product.variantes.length > 0 && (
              <div className="variant-selector-group">
                <span className="variant-selector-label">
                  Selecione a opção / modelo:
                </span>
                <div className="variant-options-list" role="radiogroup" aria-label="Variantes do produto">
                  {product.variantes.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      role="radio"
                      aria-checked={selectedVariant?.id === v.id}
                      className={`variant-pill ${selectedVariant?.id === v.id ? 'selected' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.nome}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seletor de Quantidade */}
            <div className="quantity-selector-group">
              <span className="variant-selector-label" style={{ marginBottom: 0 }}>
                Quantidade ({product.unidade}):
              </span>
              <div className="qty-stepper">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={handleDecrement}
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={16} />
                </button>
                <span className="qty-display" aria-live="polite">
                  {quantity.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                </span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={handleIncrement}
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="qty-unit-label">{product.unidade}</span>
            </div>

            {/* Botão de Adicionar */}
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '16px' }}
              onClick={handleAdd}
            >
              {addedRecently ? (
                <>
                  <Check size={20} />
                  <span>Adicionado com sucesso!</span>
                </>
              ) : (
                <>
                  <FileText size={20} />
                  <span>Adicionar ao meu orçamento</span>
                </>
              )}
            </button>

            {/* Especificações Técnicas */}
            {product.especificacoes && product.especificacoes.length > 0 && (
              <div>
                <span className="variant-selector-label" style={{ marginTop: '12px' }}>
                  Ficha Técnica
                </span>
                <table className="product-specs-table">
                  <tbody>
                    {product.especificacoes.map((spec, i) => (
                      <tr key={i}>
                        <td>{spec.chave}</td>
                        <td>{spec.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
