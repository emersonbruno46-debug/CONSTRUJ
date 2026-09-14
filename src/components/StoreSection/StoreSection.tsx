import React, { useState, useRef } from 'react';
import { MapPin, ArrowRight, Check, Eye } from 'lucide-react';
import { companyData } from '../../data/company';
import { ConstruJReveal } from '../Motion/ConstruJReveal';
import { ConstruJActionButton } from '../UI/ConstruJActionButton';
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
          {/* Lado Esquerdo: Galeria com fotos reais da loja física como gatilhos */}
          <div className="store-gallery-wrapper">
            <button
              type="button"
              className="store-photo-card large"
              onClick={(e) => handleOpenGallery(0, e)}
              aria-label="Abrir foto da fachada na galeria"
            >
              <img
                src={storePhotos[0].src}
                alt={storePhotos[0].caption}
                className="store-photo-img"
                loading="lazy"
                width="400"
                height="500"
              />
              <span className="store-photo-tag">
                <Eye size={14} aria-hidden="true" />
                <span>Fachada (ampliar)</span>
              </span>
            </button>

            <button
              type="button"
              className="store-photo-card wide"
              onClick={(e) => handleOpenGallery(1, e)}
              aria-label="Abrir foto do interior na galeria"
            >
              <img
                src={storePhotos[1].src}
                alt={storePhotos[1].caption}
                className="store-photo-img"
                loading="lazy"
                width="400"
                height="500"
              />
              <span className="store-photo-tag">
                <Eye size={14} aria-hidden="true" />
                <span>Interior • 10 fotos</span>
              </span>
            </button>
          </div>

          {/* Lado Direito: Texto Institucional com Reveal */}
          <div className="store-content-col">
            <ConstruJReveal yOffset={14}>
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

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <ConstruJActionButton
                  variant="link"
                  href={companyData.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-falar-equipe"
                  icon={<ArrowRight size={18} aria-hidden="true" />}
                  aria-label="Falar com a equipe no WhatsApp"
                >
                  Falar com a equipe
                </ConstruJActionButton>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-subtle"
                  onClick={(e) => handleOpenGallery(0, e)}
                  aria-label="Ver todas as 10 fotos da loja Constru J"
                >
                  <Eye size={16} aria-hidden="true" />
                  <span>Ver galeria completa (10 fotos)</span>
                </button>
              </div>
            </ConstruJReveal>
          </div>
        </div>
      </div>

      {/* Galeria Modal Ampliada com as 10 fotos reais */}
      <ConstruJStoreGallery
        initialIndex={activeGalleryIndex}
        onClose={handleCloseGallery}
      />
    </section>
  );
};
