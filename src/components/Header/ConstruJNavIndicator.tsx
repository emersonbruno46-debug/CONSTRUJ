import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface NavItem {
  label: string;
  href: string;
  id: string;
}

interface ConstruJNavIndicatorProps {
  items: NavItem[];
  activeSection: string;
  onNavigate?: (id: string) => void;
}

export const ConstruJNavIndicator: React.FC<ConstruJNavIndicatorProps> = ({
  items,
  activeSection,
  onNavigate
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav className="nav-desktop" aria-label="Navegação principal">
      {items.map((item) => {
        const isActive = activeSection === item.id;

        return (
          <a
            key={item.id}
            href={item.href}
            className={`nav-link ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'location' : undefined}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(item.id);
              }
            }}
          >
            <span className="nav-link-text">{item.label}</span>

            {isActive && (
              shouldReduceMotion ? (
                <span className="nav-indicator-static" aria-hidden="true" />
              ) : (
                <motion.span
                  className="nav-indicator-sliding"
                  layoutId="active-nav-indicator"
                  transition={{
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  aria-hidden="true"
                />
              )
            )}
          </a>
        );
      })}
    </nav>
  );
};
