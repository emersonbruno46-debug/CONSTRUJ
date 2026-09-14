import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import './ConstruJFloatingBar.css';

interface ConstruJFloatingBarProps {
  itemCount: number;
  isOpen: boolean;
  isAnyModalOpen: boolean;
  onOpen: () => void;
}

export const ConstruJFloatingBar: React.FC<ConstruJFloatingBarProps> = ({
  itemCount,
  isOpen,
  isAnyModalOpen,
  onOpen
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Show only if there are items, drawer is closed, and no modal is active
  const isVisible = itemCount > 0 && !isOpen && !isAnyModalOpen;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="constru-j-floating-bar-wrapper"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          role="region"
          aria-label="Acesso rápido ao meu orçamento"
        >
          <div className="constru-j-floating-bar-card">
            <div className="floating-bar-info">
              <div className="floating-bar-icon-wrap" aria-hidden="true">
                <FileText size={18} />
              </div>
              <div className="floating-bar-text">
                <strong>Meu orçamento</strong>
                <span>
                  {itemCount} {itemCount === 1 ? 'item selecionado' : 'itens selecionados'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-primary floating-bar-cta"
              onClick={onOpen}
              aria-label={`Ver lista de orçamento com ${itemCount} itens`}
            >
              <span>Ver lista</span>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
