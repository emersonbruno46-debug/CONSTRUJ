import React, { useRef, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Info,
  Copy,
  Trash,
  Tag,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { QuoteItemRow } from './QuoteItemRow';
import { QuoteItem } from '../../types/quote';
import { companyData } from '../../data/company';
import { ThiingIllustration } from '../UI/ThiingIllustration';
import './QuoteDrawer.css';

interface QuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  observacoes: string;
  onObservacoesChange: (text: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onClearQuote: () => void;
  whatsAppUrl: string;
  onShowToast: (message: string) => void;
  triggerElementRef?: React.RefObject<HTMLElement>;
}

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({
  isOpen,
  onClose,
  items,
  observacoes,
  onObservacoesChange,
  onIncrement,
  onDecrement,
  onRemove,
  onClearQuote,
  whatsAppUrl,
  onShowToast
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Manage body scroll and focus when drawer opens
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Handle keyboard: Escape closes, Tab traps
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyList = async () => {
    if (items.length === 0) {
      onShowToast('Adicione produtos à lista antes de copiar.');
      return;
    }

    const lines: string[] = [
      `Constru J — Solicitação de Orçamento:`,
      `Loja: ${companyData.nome} (${companyData.cidade} - ${companyData.estado})`,
      `----------------------------------------`
    ];

    items.forEach((item, idx) => {
      const code = item.produto.codigo ? `[${item.produto.codigo}] ` : '';
      const variant = item.variante ? ` (${item.variante.nome})` : '';
      const formattedQty = item.quantidade.toLocaleString('pt-BR', {
        maximumFractionDigits: 2
      });
      lines.push(`${idx + 1}. ${code}${item.produto.nome}${variant} — ${formattedQty} ${item.produto.unidade}`);
    });

    if (observacoes.trim()) {
      lines.push(`----------------------------------------`);
      lines.push(`Observações: ${observacoes.trim()}`);
    }

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      onShowToast('Lista de orçamento copiada para a área de transferência!');
    } catch {
      onShowToast('Não foi possível copiar automaticamente.');
    }
  };

  const handleConfirmClear = () => {
    if (items.length === 0) return;
    const confirmed = window.confirm(
      'Deseja realmente limpar todos os itens da sua lista de orçamento?'
    );
    if (confirmed) {
      onClearQuote();
      onShowToast('Lista de orçamento limpa.');
    }
  };

  const isListEmpty = items.length === 0;

  return (
    <div
      className="quote-drawer-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="quote-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-drawer-heading"
      >
        {/* Cabeçalho */}
        <div className="quote-drawer-header">
          <div className="quote-drawer-title-group">
            <h2 id="quote-drawer-heading">Meu orçamento</h2>
            <p className="quote-drawer-subtitle">
              Revise os itens e solicite pelo WhatsApp.
            </p>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className="quote-drawer-close-btn"
            onClick={onClose}
            aria-label="Fechar painel de orçamento"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Drawer */}
        <div className="quote-drawer-body">
          {isListEmpty ? (
            <div className="quote-empty-view">
              <ThiingIllustration
                name="clipboard"
                size={96}
                alt=""
                className="quote-empty-clipboard-img"
              />
              <div className="quote-empty-title">Sua lista está vazia</div>
              <p className="quote-empty-desc">
                Navegue pelo catálogo e clique em &quot;Adicionar ao orçamento&quot; nos produtos que você precisa para sua obra.
              </p>
            </div>
          ) : (
            <>
              {/* Lista de itens selecionados */}
              <div role="list" aria-label="Produtos no orçamento">
                {items.map((item) => (
                  <QuoteItemRow
                    key={item.id}
                    item={item}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                    onRemove={onRemove}
                  />
                ))}
              </div>

              {/* Campo de Observações opcionais */}
              <div className="quote-observations-wrapper">
                <div className="quote-observations-label-row">
                  <label htmlFor="quote-notes">Observações opcionais</label>
                  <span className="quote-char-counter">
                    {observacoes.length}/500
                  </span>
                </div>
                <textarea
                  id="quote-notes"
                  className="quote-textarea"
                  placeholder="Ex.: cor, modelo, referência, local de entrega ou horário para contato..."
                  value={observacoes}
                  onChange={(e) => onObservacoesChange(e.target.value)}
                  maxLength={500}
                />
              </div>

              {/* Ações Secundárias (Copiar e Limpar) */}
              <div className="quote-secondary-actions">
                <button
                  type="button"
                  className="btn-copy-list"
                  onClick={handleCopyList}
                  aria-label="Copiar lista de orçamento como texto"
                >
                  <Copy size={14} />
                  <span>Copiar lista</span>
                </button>

                <button
                  type="button"
                  className="btn-clear-list"
                  onClick={handleConfirmClear}
                  aria-label="Limpar todos os produtos da lista"
                >
                  <Trash size={14} />
                  <span>Limpar lista</span>
                </button>
              </div>
            </>
          )}

          {/* Banner de Ofertas da Loja (conforme referência 2) */}
          <a
            href={`https://wa.me/${companyData.whatsapp.internacional}?text=${encodeURIComponent('Olá, Constru J! Gostaria de saber quais são as ofertas vigentes da loja nesta semana.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="quote-offers-banner"
            aria-label="Consultar ofertas da loja pelo WhatsApp"
          >
            <div className="quote-offers-content">
              <Tag size={20} className="quote-offers-tag-icon" aria-hidden="true" />
              <div className="quote-offers-text">
                <strong>Ofertas da loja</strong>
                <span>Consulte as condições pelo WhatsApp</span>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-brand-orange)" aria-hidden="true" />
          </a>
        </div>

        {/* Rodapé do Drawer */}
        <div className="quote-drawer-footer">
          {isListEmpty ? (
            <a
              href={companyData.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', gap: '10px' }}
            >
              <MessageCircle size={20} />
              <span>Falar com a loja no WhatsApp</span>
            </a>
          ) : (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-quote"
              id="btn-enviar-orcamento-whatsapp"
            >
              <MessageCircle size={20} aria-hidden="true" />
              <span>Solicitar pelo WhatsApp</span>
            </a>
          )}

          <div className="quote-disclaimer">
            <Info size={16} style={{ flexShrink: 0, color: 'var(--color-primary-green)' }} aria-hidden="true" />
            <span>
              Disponibilidade, frete e condições comerciais confirmados pela equipe no atendimento.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
