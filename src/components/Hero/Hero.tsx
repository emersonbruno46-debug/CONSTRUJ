import React from 'react';
import { ShoppingBag, MessageCircle, MapPin } from 'lucide-react';
import { companyData } from '../../data/company';
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
            <h1 id="hero-title" className="hero-title">
              Tudo para construir e reformar, em um só lugar.
            </h1>
            <p className="hero-description">
              Materiais de construção e acabamentos em Rio Pardo de Minas.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onExploreCatalog}
                id="btn-explorar-produtos"
              >
                <ShoppingBag size={20} aria-hidden="true" />
                <span>Explorar produtos</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onOpenQuoteWhatsApp}
                id="btn-pedir-orcamento-hero"
              >
                <MessageCircle size={20} aria-hidden="true" />
                <span>Pedir orçamento</span>
              </button>
            </div>

            <div className="hero-signature" aria-label="Slogan oficial da Constru J">
              {companyData.slogan}
            </div>
          </div>

          {/* Lado Direito: Foto Real da Fachada */}
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
