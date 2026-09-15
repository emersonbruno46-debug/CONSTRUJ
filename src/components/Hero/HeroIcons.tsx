import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Ícone CONSTRUÇÃO (Tijolos / Alvenaria em outline laranja)
 */
export const IconConstrucao: React.FC<IconProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Bloco 1 - Linha superior */}
    <rect x="4" y="6" width="11" height="5" rx="1.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="17" y="6" width="11" height="5" rx="1.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Bloco 2 - Linha média */}
    <rect x="2" y="13.5" width="7" height="5" rx="1.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="11" y="13.5" width="10" height="5" rx="1.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="23" y="13.5" width="7" height="5" rx="1.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Bloco 3 - Linha inferior */}
    <rect x="4" y="21" width="11" height="5" rx="1.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="17" y="21" width="11" height="5" rx="1.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Ícone REFORMA (Rolo de pintura em outline laranja)
 */
export const IconReforma: React.FC<IconProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Rolo */}
    <rect x="7" y="4" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Haste metálica do rolo */}
    <path
      d="M25 8H27C28.1 8 29 8.9 29 10V14C29 15.1 28.1 16 27 16H17V20"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Cabo de borracha */}
    <rect x="14.5" y="20" width="5" height="8" rx="1.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Ícone ACABAMENTO (Revestimentos cerâmicos / pisos com brilho)
 */
export const IconAcabamento: React.FC<IconProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Grid de 4 azulejos */}
    <rect x="4" y="4" width="10.5" height="10.5" rx="1.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="17.5" y="4" width="10.5" height="10.5" rx="1.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="4" y="17.5" width="10.5" height="10.5" rx="1.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="17.5" y="17.5" width="10.5" height="10.5" rx="1.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Estrelinha de brilho/acabamento perfeito */}
    <path
      d="M22.5 7L23.2 8.8L25 9.5L23.2 10.2L22.5 12L21.8 10.2L20 9.5L21.8 8.8L22.5 7Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Ícone FERRAMENTAS (Chave de boca e chave cruzada)
 */
export const IconFerramentas: React.FC<IconProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Chave inglesa 1 */}
    <path
      d="M24.8 5.2C23.6 4 21.8 3.8 20.3 4.6L16.4 8.5L19.2 11.3L23.1 7.4C23.9 5.9 23.7 4.1 22.5 2.9M16.4 8.5L6.5 18.4C5.7 19.2 5.7 20.5 6.5 21.3L10.7 25.5C11.5 26.3 12.8 26.3 13.6 25.5L23.5 15.6M16.4 8.5L19.2 11.3"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Chave de fenda 2 cruzada */}
    <path
      d="M7.2 7.2L12.5 12.5M19.5 19.5L24.8 24.8M23.5 26L26 23.5M6 8.5L8.5 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Símbolo da Casa Constru-J (Telhado Laranja + Parede Verde + Chaminé)
 */
export const ConstruJHouseBadge: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = ''
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Chaminé verde */}
    <rect x="10" y="8" width="4.5" height="8" rx="1" fill="#149B35" />
    
    {/* Telhado Laranja em V invertido */}
    <path
      d="M6 18.5L20 7L34 18.5"
      stroke="#FF7100"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Corpo da Casa Verde */}
    <path
      d="M10.5 18V31C10.5 32.1 11.4 33 12.5 33H27.5C28.6 33 29.5 32.1 29.5 31V18"
      stroke="#149B35"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Porta Laranja */}
    <path
      d="M17 33V22C17 21.2 17.7 20.5 18.5 20.5H21.5C22.3 20.5 23 21.2 23 22V33"
      fill="#FF7100"
    />
  </svg>
);
