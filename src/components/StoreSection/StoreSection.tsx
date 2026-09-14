import React from 'react';
import { MapPin, ArrowRight, Check } from 'lucide-react';
import { companyData } from '../../data/company';
import './StoreSection.css';

export const StoreSection: React.FC = () => {
  return (
    <section id="loja" className="store-section" aria-labelledby="store-heading">
      <div className="container">
        <div className="store-grid">
          {/* Lado Esquerdo: Galeria com fotos reais da loja física */}
          <div className="store-gallery-wrapper">
            <div className="store-photo-card large">
              <img
                src="/assets/fotos/ac269705d1c25943.jpg"
                alt="Fachada real do prédio da Constru J em Rio Pardo de Minas"
                className="store-photo-img"
                loading="lazy"
                width="400"
                height="500"
              />
              <span className="store-photo-tag">Fachada da loja</span>
            </div>

            <div className="store-photo-card wide">
              <img
                src="/assets/fotos/f081c7e87f1915e5.jpg"
                alt="Interior da Constru J mostrando prateleiras e equipamentos"
                className="store-photo-img"
                loading="lazy"
                width="400"
                height="500"
              />
              <span className="store-photo-tag">Ambiente e atendimento</span>
            </div>
          </div>

          {/* Lado Direito: Texto Institucional */}
          <div className="store-content-col">
            <div className="store-eyebrow-badge">
              <MapPin size={14} aria-hidden="true" />
              <span>{companyData.cidade} • {companyData.estado}</span>
            </div>

            <h2 id="store-heading" className="store-title">
              Da base ao acabamento, conte com a gente.
            </h2>

            <p className="store-description">
              Materiais de construção e atendimento para ajudar nas escolhas da sua obra. Aqui você encontra tudo para reformar, construir ou ampliar com comodidade e suporte de quem conhece a sua região.
            </p>

            <ul className="store-features-list">
              <li className="store-feature-item">
                <span className="store-feature-bullet" aria-hidden="true">
                  <Check size={14} />
                </span>
                <span>Atendimento próximo e dedicado para calcular materiais</span>
              </li>
              <li className="store-feature-item">
                <span className="store-feature-bullet" aria-hidden="true">
                  <Check size={14} />
                </span>
                <span>Variedade física em pisos, tintas, ferramentas e tubulações</span>
              </li>
              <li className="store-feature-item">
                <span className="store-feature-bullet" aria-hidden="true">
                  <Check size={14} />
                </span>
                <span>Orçamento rápido e direto pelo WhatsApp</span>
              </li>
            </ul>

            <a
              href={companyData.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-team-link"
              id="btn-falar-equipe"
            >
              <span>Falar com a equipe</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
