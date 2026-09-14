import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { QuoteItem } from '../../types/quote';

interface QuoteItemRowProps {
  item: QuoteItem;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

export const QuoteItemRow: React.FC<QuoteItemRowProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove
}) => {
  const { produto, variante, quantidade } = item;

  return (
    <div className="quote-item-card" role="listitem">
      {/* Imagem miniatura */}
      <div className="quote-item-thumb">
        <img
          src={produto.imagem}
          alt={produto.alt || produto.nome}
          width="56"
          height="56"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* Detalhes do item */}
      <div className="quote-item-details">
        <div className="quote-item-title-row">
          <div>
            <div className="quote-item-name">{produto.nome}</div>
            {variante && (
              <div className="quote-item-variant">Opção: {variante.nome}</div>
            )}
          </div>

          <button
            type="button"
            className="quote-item-remove-btn"
            onClick={() => onRemove(item.id)}
            aria-label={`Remover ${produto.nome} da lista de orçamento`}
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Linha de Stepper e Unidade */}
        <div className="quote-item-bottom-row">
          <div className="quote-item-stepper">
            <button
              type="button"
              className="quote-stepper-btn"
              onClick={() => onDecrement(item.id)}
              aria-label={`Diminuir quantidade de ${produto.nome}`}
            >
              <Minus size={14} />
            </button>
            <span className="quote-stepper-qty" aria-live="polite">
              {quantidade.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
            </span>
            <button
              type="button"
              className="quote-stepper-btn"
              onClick={() => onIncrement(item.id)}
              aria-label={`Aumentar quantidade de ${produto.nome}`}
            >
              <Plus size={14} />
            </button>
          </div>

          <span className="quote-item-unit">{produto.unidade}</span>
        </div>
      </div>
    </div>
  );
};
