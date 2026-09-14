import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface ConstruJQuoteCountProps {
  count: number;
}

export const ConstruJQuoteCount: React.FC<ConstruJQuoteCountProps> = ({ count }) => {
  const shouldReduceMotion = useReducedMotion();

  if (count <= 0) return null;

  if (shouldReduceMotion) {
    return (
      <span className="quote-count-badge" aria-hidden="true">
        {count}
      </span>
    );
  }

  return (
    <span className="quote-count-badge" aria-hidden="true" style={{ overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={count}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block' }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
