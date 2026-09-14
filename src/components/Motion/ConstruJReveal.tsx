import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ConstruJRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  as?: React.ElementType;
}

export const ConstruJReveal: React.FC<ConstruJRevealProps> = ({
  children,
  delay = 0,
  duration = 0.42,
  yOffset = 12,
  className = '',
  as = 'div'
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, render without translation and minimal fade
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const MotionComponent = motion.create(as);

  return (
    <MotionComponent
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration,
        delay: Math.min(delay, 0.225),
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </MotionComponent>
  );
};
