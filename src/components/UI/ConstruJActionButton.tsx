import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './ConstruJActionButton.css';

interface ConstruJActionButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  variant?: 'primary' | 'secondary' | 'white' | 'orange' | 'link';
  className?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export const ConstruJActionButton: React.FC<ConstruJActionButtonProps> = ({
  children,
  icon,
  onClick,
  href,
  target,
  rel,
  variant = 'primary',
  className = '',
  id,
  type = 'button',
  'aria-label': ariaLabel
}) => {
  const shouldReduceMotion = useReducedMotion();

  const variantClass = `btn-action-${variant}`;
  const baseClasses = `constru-j-action-btn ${variantClass} ${className}`.trim();

  const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const iconMotionProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { x: 3 },
        transition: { duration: 0.18, ease: EASE_CUBIC }
      };

  const tapMotionProps = shouldReduceMotion
    ? {}
    : {
        whileTap: { scale: 0.98 },
        transition: { duration: 0.1 }
      };

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={baseClasses}
        onClick={onClick}
        id={id}
        aria-label={ariaLabel}
        {...tapMotionProps}
      >
        <span className="action-btn-text">{children}</span>
        {icon && (
          <motion.span className="action-btn-icon" {...iconMotionProps}>
            {icon}
          </motion.span>
        )}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      id={id}
      aria-label={ariaLabel}
      {...tapMotionProps}
    >
      <span className="action-btn-text">{children}</span>
      {icon && (
        <motion.span className="action-btn-icon" {...iconMotionProps}>
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
};
