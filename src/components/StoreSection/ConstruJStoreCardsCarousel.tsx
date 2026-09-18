import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, MoveHorizontal } from 'lucide-react';
import { Autoplay, EffectCards, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperCore } from 'swiper';
import { motion, useReducedMotion } from 'motion/react';
import { storePhotos, StorePhoto } from './ConstruJStoreGallery';
import { cn } from '@/lib/utils';

import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './ConstruJStoreCardsCarousel.css';

interface ConstruJStoreCardsCarouselProps {
  onOpenPhoto: (index: number) => void;
  className?: string;
  autoplay?: boolean;
}

export const ConstruJStoreCardsCarousel: React.FC<ConstruJStoreCardsCarouselProps> = ({
  onOpenPhoto,
  className,
  autoplay = false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const swiperRef = useRef<SwiperCore | null>(null);

  return (
    <motion.div
      className={cn('store-cards-carousel-container', className)}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        effect="cards"
        grabCursor={true}
        loop={true}
        touchReleaseOnEdges={true}
        touchStartPreventDefault={false}
        touchMoveStopPropagation={false}
        passiveListeners={true}
        autoplay={
          autoplay
            ? {
                delay: 3500,
                disableOnInteraction: true,
                pauseOnMouseEnter: true
              }
            : false
        }
        modules={[EffectCards, Autoplay, Pagination, Navigation]}
        className="store-swiper-cards"
        cardsEffect={{
          perSlideRotate: 4,
          perSlideOffset: 10,
          rotate: true,
          slideShadows: true
        }}
      >
        {storePhotos.map((photo: StorePhoto, index: number) => (
          <SwiperSlide
            key={photo.id}
            className="store-cards-slide"
            onClick={() => onOpenPhoto(index)}
          >
            {/* Foto Real da Loja */}
            <img
              src={photo.src}
              alt={photo.caption}
              className="store-card-img"
              loading={index < 3 ? 'eager' : 'lazy'}
              width="400"
              height="500"
            />

            {/* Gradiente Escuro na Base */}
            <div className="store-card-overlay" />

            {/* Tag no Topo com Efeito Vidro */}
            <div className="store-card-top-tag">
              <span>{index + 1} de {storePhotos.length}</span>
            </div>

            {/* Botão de Ampliar */}
            <button
              type="button"
              className="store-card-expand-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenPhoto(index);
              }}
              aria-label={`Ampliar foto: ${photo.title}`}
            >
              <Maximize2 size={16} />
            </button>

            {/* Informações da Loja */}
            <div className="store-card-info">
              <strong className="store-card-title">{photo.title}</strong>
              <p className="store-card-caption">{photo.caption}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Controles de Navegação e Dica de Interação */}
      <div className="store-carousel-controls">
        <button
          type="button"
          className="store-nav-arrow"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Foto anterior da loja"
        >
          <ChevronLeft size={22} />
        </button>

        <span className="store-carousel-hint" aria-hidden="true">
          <MoveHorizontal size={14} />
          <span>Arraste as cartas</span>
        </span>

        <button
          type="button"
          className="store-nav-arrow"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Próxima foto da loja"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </motion.div>
  );
};
