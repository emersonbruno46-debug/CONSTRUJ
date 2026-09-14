import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ConstruJBrandUnderlineProps {
  className?: string;
}

export const ConstruJBrandUnderline: React.FC<ConstruJBrandUnderlineProps> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className={`brand-underline-bar ${className}`}
        style={{
          width: '100%',
          height: '3px',
          backgroundColor: 'var(--color-brand-orange)',
          borderRadius: '9999px',
          marginTop: '4px'
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      className={`brand-underline-bar ${className}`}
      style={{
        width: '100%',
        height: '3px',
        backgroundColor: 'var(--color-brand-orange)',
        borderRadius: '9999px',
        marginTop: '4px',
        transformOrigin: 'left center'
      }}
      initial={{ scaleX: 0, opacity: 0.6 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{
        duration: 0.45,
        delay: 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      aria-hidden="true"
    />
  );
};
