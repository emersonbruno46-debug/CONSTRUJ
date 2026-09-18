import React, { useState, useRef } from 'react';
import { MapPin, Check, Eye } from 'lucide-react';
import { companyData } from '../../data/company';
import { ConstruJReveal } from '../Motion/ConstruJReveal';
import { InteractiveHoverButton } from '../UI/interactive-hover-button';
import { ThiingIllustration } from '../UI/ThiingIllustration';
import { ConstruJStoreCardsCarousel } from './ConstruJStoreCardsCarousel';
import { ConstruJStoreGallery, storePhotos } from './ConstruJStoreGallery';
import './StoreSection.css';

export const StoreSection: React.FC = () => {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleOpenGallery = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = e.currentTarget;
    setActiveGalleryIndex(index);
  };

  const handleCloseGallery = () => {
    setActiveGalleryIndex(null);
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 50);
  };

  return (
    <section id="loja" className="store-section" aria-labelledby="store-heading">
      <div className="container">
        <div className="store-grid">
          {/* Lado Esquerdo: Carrossel Swiper Cards com as fotos reais */}
          <div className="store-gallery-wrapper">
            <ConstruJStoreCardsCarousel
              onOpenPhoto={(index) => setActiveGalleryIndex(index)}
              autoplay={true}
            />
          </div>

          {/* Lado Direito: Texto Institucional com Reveal */}
          <div className="store-content-col">
            <ConstruJReveal yOffset={14}>
              <div className="store-eyebrow-badge">
                <MapPin size={14} aria-hidden="true" />
                <span>{companyData.cidade} • {companyData.estado}</span>
              </div>

              <div className="store-heading-with-accent">
                <h2 id="store-heading" className="store-title">
                  Da base ao acabamento, conte com a gente.
                </h2>
                <ThiingIllustration
                  name="hard-hat"
                  size={72}
                  alt=""
                  className="store-hard-hat-accent"
                />
              </div>

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

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <InteractiveHoverButton
                  variant="primary"
                  href={companyData.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-falar-equipe"
                  text="Falar com a equipe"
                  aria-label="Falar com a equipe no WhatsApp"
                />

                <button
                  type="button"
                  className="btn btn-sm btn-outline-subtle"
                  onClick={(e) => handleOpenGallery(0, e)}
                  aria-label={`Ver todas as ${storePhotos.length} fotos da loja Constru J`}
                >
                  <Eye size={16} aria-hidden="true" />
                  <span>Ver galeria completa ({storePhotos.length} fotos)</span>
                </button>
              </div>
            </ConstruJReveal>
          </div>
        </div>
      </div>

      {/* Galeria Modal Ampliada com as fotos reais */}
      <ConstruJStoreGallery
        initialIndex={activeGalleryIndex}
        onClose={handleCloseGallery}
      />
    </section>
  );
};
