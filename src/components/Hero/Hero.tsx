import React from 'react';
import { ShoppingCart, ChevronRight, FileText, MapPin, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { companyData } from '../../data/company';
import {
  IconConstrucao,
  IconReforma,
  IconAcabamento,
  IconFerramentas,
  ConstruJHouseBadge
} from './HeroIcons';
import './Hero.css';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenQuoteWhatsApp: () => void;
  onSelectCategory?: (category: 'basicos' | 'tintas' | 'pisos' | 'ferramentas') => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onOpenQuoteWhatsApp,
  onSelectCategory
}) => {
  const shouldReduceMotion = useReducedMotion();

  const handleCategoryClick = (cat: 'basicos' | 'tintas' | 'pisos' | 'ferramentas') => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      onExploreCatalog();
    }
  };

  // Definições de variantes de animação escalonadas (stagger)
  const fadeUp = (delay: number, distance: number = 24) =>
    shouldReduceMotion
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: distance },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.7,
            delay,
            ease: [0.16, 1, 0.3, 1] as const
          }
        };

  return (
    <section id="inicio" className="hero-section" aria-labelledby="hero-title">
      {/* Luz ambiente de fundo muito sutil */}
      <div className="hero-ambient-glow" aria-hidden="true" />

      <div className="container hero-container">
        <div className="hero-grid">
          {/* ==========================================================
              LADO ESQUERDO: HIERARQUIA INSTITUCIONAL E CONVERSÃO
              ========================================================== */}
          <div className="hero-content">
            {/* Eyebrow Institucional */}
            <motion.div
              className="hero-eyebrow-wrapper"
              {...fadeUp(0.06, 12)}
            >
              <span className="hero-eyebrow">CONSTRU-J</span>
              <span className="hero-eyebrow-line" aria-hidden="true" />
            </motion.div>

            {/* Headline Principal de Alto Impacto */}
            <motion.h1
              id="hero-title"
              className="hero-headline"
              {...fadeUp(0.16, 28)}
            >
              Tudo para
              <span className="hero-highlight-break">
                <span className="hero-headline-green">construir e</span>
              </span>
              <span className="hero-highlight-break">
                <span className="hero-headline-green">reformar,</span> em
              </span>
              um só lugar.
            </motion.h1>

            {/* Subtítulo Claro e Elegante */}
            <motion.p
              className="hero-subtitle"
              {...fadeUp(0.28, 16)}
            >
              Materiais de construção e acabamentos em Rio Pardo de Minas.
            </motion.p>

            {/* Ações / CTAs */}
            <motion.div
              className="hero-actions-group"
              {...fadeUp(0.38, 18)}
            >
              {/* Botão Principal: Explorar Produtos */}
              <button
                type="button"
                id="btn-explorar-produtos"
                className="hero-btn-primary"
                onClick={onExploreCatalog}
                aria-label="Explorar produtos do catálogo"
              >
                <span className="hero-btn-icon-start">
                  <ShoppingCart size={19} aria-hidden="true" />
                </span>
                <span className="hero-btn-label">Explorar produtos</span>
                <span className="hero-btn-icon-arrow" aria-hidden="true">
                  <ChevronRight size={18} />
                </span>
              </button>

              {/* Botão Secundário: Pedir Orçamento */}
              <button
                type="button"
                id="btn-pedir-orcamento-hero"
                className="hero-btn-secondary"
                onClick={onOpenQuoteWhatsApp}
                aria-label="Pedir orçamento pelo WhatsApp"
              >
                <span className="hero-btn-icon-start">
                  <FileText size={18} aria-hidden="true" />
                </span>
                <span className="hero-btn-label">Pedir orçamento</span>
              </button>
            </motion.div>

            {/* Linha com 4 Cards de Categorias */}
            <motion.div
              className="hero-categories-row"
              aria-label="Categorias principais"
              {...fadeUp(0.48, 20)}
            >
              <button
                type="button"
                className="hero-category-card"
                onClick={() => handleCategoryClick('basicos')}
                title="Ver materiais de construção"
              >
                <div className="hero-category-icon-box">
                  <IconConstrucao size={28} />
                </div>
                <span className="hero-category-name">CONSTRUÇÃO</span>
              </button>

              <button
                type="button"
                className="hero-category-card"
                onClick={() => handleCategoryClick('tintas')}
                title="Ver tintas e materiais de reforma"
              >
                <div className="hero-category-icon-box">
                  <IconReforma size={28} />
                </div>
                <span className="hero-category-name">REFORMA</span>
              </button>

              <button
                type="button"
                className="hero-category-card"
                onClick={() => handleCategoryClick('pisos')}
                title="Ver pisos e acabamentos"
              >
                <div className="hero-category-icon-box">
                  <IconAcabamento size={28} />
                </div>
                <span className="hero-category-name">ACABAMENTO</span>
              </button>

              <button
                type="button"
                className="hero-category-card"
                onClick={() => handleCategoryClick('ferramentas')}
                title="Ver ferramentas e acessórios"
              >
                <div className="hero-category-icon-box">
                  <IconFerramentas size={28} />
                </div>
                <span className="hero-category-name">FERRAMENTAS</span>
              </button>
            </motion.div>

            {/* Assinatura Institucional Inferior */}
            <motion.div
              className="hero-institutional-signature"
              {...fadeUp(0.58, 14)}
            >
              <span className="hero-sig-accent-line" aria-hidden="true" />
              <span className="hero-sig-text">A MAIS COMPLETA E PREFERIDA</span>
            </motion.div>
          </div>

          {/* ==========================================================
              LADO DIREITO: FOTO LIMPA DA FACHADA COM COMPOSIÇÃO ARQUITETÔNICA
              ========================================================== */}
          <div className="hero-media-column">
            <motion.div
              className="hero-media-composition"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
            >
              {/* Elementos Decorativos Orgânicos Integrados */}
              {/* Strip Verde Curvada Superior/Esquerda */}
              <div className="hero-deco-curve-green" aria-hidden="true" />

              {/* Strip Laranja Curvada Interna */}
              <div className="hero-deco-curve-orange" aria-hidden="true" />

              {/* Pílula Vertical Verde de Conexão */}
              <div className="hero-deco-pill-green" aria-hidden="true" />

              {/* Gancho Curvado Laranja na Base Esquerda da Foto */}
              <div className="hero-deco-hook-orange" aria-hidden="true" />

              {/* Bloco Angular Verde Escuro na Base Direita */}
              <div className="hero-deco-wedge-forest" aria-hidden="true" />

              {/* Moldura da Imagem da Fachada */}
              <div className="hero-photo-frame">
                <img
                  src="/assets/fotos/fachada-constru-j-limpa.jpg"
                  alt="Fachada oficial e moderna da loja Constru-J em Rio Pardo de Minas"
                  className="hero-facade-image"
                  width="1000"
                  height="680"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              {/* Card Flutuante 1: Localização (Topo Direito da Foto) */}
              <motion.div
                className="hero-float-card-location"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.62, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <div className="hero-loc-icon-bubble" aria-hidden="true">
                  <MapPin size={22} className="hero-loc-pin-svg" />
                </div>
                <div className="hero-loc-texts">
                  <span className="hero-loc-eyebrow">LOJA FÍSICA EM</span>
                  <span className="hero-loc-city">RIO PARDO DE MINAS</span>
                  <span className="hero-loc-subtext">AQUI TEM CONSTRUÇÃO DE VERDADE</span>
                </div>
              </motion.div>

              {/* Card Flutuante 2: Qualidade e Variedade (Base Direita da Foto) */}
              <motion.div
                className="hero-float-card-quality"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.72, ease: [0.16, 1, 0.3, 1] as const }}
                onClick={onExploreCatalog}
                role="button"
                tabIndex={0}
                aria-label="Qualidade e variedade para o seu projeto. Clique para ver o catálogo"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onExploreCatalog();
                  }
                }}
              >
                <div className="hero-quality-badge-icon" aria-hidden="true">
                  <ConstruJHouseBadge size={34} />
                </div>
                <div className="hero-quality-copy">
                  <span className="hero-quality-line1">Qualidade e variedade</span>
                  <span className="hero-quality-line2">para o seu projeto.</span>
                </div>
                <div className="hero-quality-arrow-btn" aria-hidden="true">
                  <ChevronRight size={18} />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
