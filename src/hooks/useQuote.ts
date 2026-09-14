import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, ProductVariant } from '../types/catalog';
import { QuoteItem } from '../types/quote';
import { companyData } from '../data/company';

const STORAGE_KEY = 'CONSTRU_J_QUOTE_V1';

export function useQuote() {
  const [items, setItems] = useState<QuoteItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.items)) {
        // Validate each item structure
        return parsed.items.filter(
          (it: any) =>
            it &&
            typeof it.id === 'string' &&
            it.produto &&
            typeof it.produto.id === 'string' &&
            typeof it.quantidade === 'number' &&
            it.quantidade > 0 &&
            !isNaN(it.quantidade)
        );
      }
      return [];
    } catch {
      return [];
    }
  });

  const [observacoes, setObservacoesState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return '';
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.observacoes === 'string') {
        return parsed.observacoes.slice(0, 500);
      }
      return '';
    } catch {
      return '';
    }
  });

  // Save to localStorage when items or observacoes change
  useEffect(() => {
    try {
      const payload = {
        version: 1,
        items,
        observacoes: observacoes.slice(0, 500)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Erro ao persistir orçamento no localStorage', e);
    }
  }, [items, observacoes]);

  const setObservacoes = useCallback((text: string) => {
    setObservacoesState(text.slice(0, 500));
  }, []);

  const getItemId = useCallback((productId: string, variantId?: string) => {
    return variantId ? `${productId}__${variantId}` : productId;
  }, []);

  const addItem = useCallback(
    (produto: Product, variante?: ProductVariant, quantidade?: number) => {
      const initialQty =
        quantidade && quantidade > 0
          ? quantidade
          : produto.quantidadeMinima || 1;

      const itemId = getItemId(produto.id, variante?.id);

      setItems((prev) => {
        const existingIndex = prev.findIndex((it) => it.id === itemId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          const current = updated[existingIndex];
          const newQty = Number((current.quantidade + initialQty).toFixed(2));
          updated[existingIndex] = {
            ...current,
            quantidade: newQty
          };
          return updated;
        }

        const newItem: QuoteItem = {
          id: itemId,
          productId: produto.id,
          produto,
          variante,
          quantidade: initialQty
        };
        return [...prev, newItem];
      });
    },
    [getItemId]
  );

  const updateQuantity = useCallback((itemId: string, newQty: number) => {
    setItems((prev) => {
      if (newQty <= 0) {
        return prev.filter((it) => it.id !== itemId);
      }
      return prev.map((it) => {
        if (it.id === itemId) {
          return {
            ...it,
            quantidade: Number(newQty.toFixed(2))
          };
        }
        return it;
      });
    });
  }, []);

  const incrementQuantity = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const inc = it.produto.incremento || 1;
          const nextVal = Number((it.quantidade + inc).toFixed(2));
          return { ...it, quantidade: nextVal };
        }
        return it;
      })
    );
  }, []);

  const decrementQuantity = useCallback((itemId: string) => {
    setItems((prev) => {
      const item = prev.find((it) => it.id === itemId);
      if (!item) return prev;

      const inc = item.produto.incremento || 1;
      const min = item.produto.quantidadeMinima || 1;
      const nextVal = Number((item.quantidade - inc).toFixed(2));

      if (nextVal < min) {
        // Remover item ao decrementar abaixo do mínimo
        return prev.filter((it) => it.id !== itemId);
      }

      return prev.map((it) => (it.id === itemId ? { ...it, quantidade: nextVal } : it));
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  }, []);

  const clearQuote = useCallback(() => {
    setItems([]);
    setObservacoesState('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const totalDistinctItems = useMemo(() => items.length, [items]);

  const generateWhatsAppMessage = useCallback(() => {
    if (items.length === 0) {
      return `Olá, Constru J! Gostaria de falar com a equipe de atendimento sobre materiais de construção.`;
    }

    const lines: string[] = [
      `Olá, Constru J! Gostaria de solicitar um orçamento:\n`
    ];

    items.forEach((item, index) => {
      const num = index + 1;
      const cod = item.produto.codigo ? `[${item.produto.codigo}] ` : '';
      const varInfo = item.variante ? ` — ${item.variante.nome}` : '';
      // Formatação de quantidade brasileira (vírgula como decimal se aplicável)
      const formattedQty = item.quantidade.toLocaleString('pt-BR', {
        maximumFractionDigits: 2
      });
      lines.push(`${num}. ${cod}${item.produto.nome}${varInfo} — ${formattedQty} ${item.produto.unidade}`);
    });

    if (observacoes.trim()) {
      lines.push(`\nObservações: ${observacoes.trim()}`);
    }

    lines.push(`\nPor favor, confirme disponibilidade, valores e condições de entrega.`);

    return lines.join('\n');
  }, [items, observacoes]);

  const whatsAppUrl = useMemo(() => {
    const message = generateWhatsAppMessage();
    return `https://wa.me/${companyData.whatsapp.internacional}?text=${encodeURIComponent(message)}`;
  }, [generateWhatsAppMessage]);

  return {
    items,
    observacoes,
    setObservacoes,
    addItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearQuote,
    totalDistinctItems,
    generateWhatsAppMessage,
    whatsAppUrl
  };
}
