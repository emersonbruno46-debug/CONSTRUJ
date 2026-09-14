import React from 'react';
import { ShoppingBag, MessageCircle, MapPin } from 'lucide-react';
import { companyData } from '../../data/company';
import { ConstruJReveal } from '../Motion/ConstruJReveal';
import { ConstruJBrandUnderline } from '../Motion/ConstruJBrandUnderline';
import { ConstruJActionButton } from '../UI/ConstruJActionButton';
import './Hero.css';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenQuoteWhatsApp: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onOpenQuoteWhatsApp
}) => {
  return (
    <section id="inicio" className="hero-section" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-grid">
          {/* Lado Esquerdo: Mensagem Oficial */}
          <div className="hero-content">
            <span className="hero-eyebrow">CONSTRU J</span>
            {/* H1 visível no primeiro frame sem atraso */}
            <h1 id="hero-title" className="hero-title">
              Tudo para construir e reformar, em um só lugar.
            </h1>

            {/* Subtítulo e Ações com Reveal Discreto */}
            <ConstruJReveal delay={0.06} yOffset={12} duration={0.42}>
              <p className="hero-description">
                Materiais de construção e acabamentos em Rio Pardo de Minas.
              </p>

              <div className="hero-actions">
                <ConstruJActionButton
                  variant="primary"
                  onClick={onExploreCatalog}
                  id="btn-explorar-produtos"
                  icon={<ShoppingBag size={18} aria-hidden="true" />}
                  aria-label="Explorar produtos do catálogo"
                >
                  Explorar produtos
                </ConstruJActionButton>

                <ConstruJActionButton
                  variant="secondary"
                  onClick={onOpenQuoteWhatsApp}
                  id="btn-pedir-orcamento-hero"
                  icon={<MessageCircle size={18} aria-hidden="true" />}
                  aria-label="Pedir orçamento pelo WhatsApp"
                >
                  Pedir orçamento
                </ConstruJActionButton>
              </div>

              <div className="hero-signature-wrapper" aria-label="Slogan oficial da Constru J">
                <span className="hero-signature">{companyData.slogan}</span>
                <ConstruJBrandUnderline />
              </div>
            </ConstruJReveal>
          </div>

          {/* Lado Direito: Foto Real da Fachada (carregamento imediato sem reveal) */}
          <div className="hero-media">
            <div className="hero-orange-accent" aria-hidden="true"></div>
            <div className="hero-image-wrapper">
              <img
                src="/assets/fotos/ac269705d1c25943.jpg"
                alt="Fachada real da loja Constru J em Rio Pardo de Minas"
                className="hero-image"
                width="720"
                height="540"
                loading="eager"
              />
              <div className="hero-image-badge">
                <span className="hero-badge-dot" aria-hidden="true"></span>
                <MapPin size={14} aria-hidden="true" />
                <span>{companyData.cidade} • MG | Aqui tem construção de verdade</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
