import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import './ConstruJStoreGallery.css';

export interface StorePhoto {
  id: string;
  src: string;
  title: string;
  caption: string;
}

export const storePhotos: StorePhoto[] = [
  {
    id: 'fachada-principal',
    src: '/assets/fotos/ac269705d1c25943.jpg',
    title: 'Fachada Principal',
    caption: 'Fachada externa e entrada principal do prédio da Constru J em Rio Pardo de Minas.'
  },
  {
    id: 'interior-maquinas',
    src: '/assets/fotos/f081c7e87f1915e5.jpg',
    title: 'Ambiente Interno e Equipamentos',
    caption: 'Espaço interno com motocultivadores, carrinhos, assentos sanitários e ferramentas.'
  },
  {
    id: 'ferramentas-maquinas',
    src: '/assets/fotos/993f15f9e9a83171.jpg',
    title: 'Setor de Maquinários e Ferramentas',
    caption: 'Área com equipamentos para obras, agricultura e manutenção geral.'
  },
  {
    id: 'corredor-prateleiras',
    src: '/assets/fotos/cb4d48cf266ac982.jpg',
    title: 'Corredores e Prateleiras Organizadas',
    caption: 'Amplo sortimento de materiais de consumo imediato e ferragens.'
  },
  {
    id: 'balcao-atendimento',
    src: '/assets/fotos/5cc9f112ed7ce6bd.jpg',
    title: 'Balcão de Atendimento',
    caption: 'Equipe pronta para orientar sobre quantidades e especificações de materiais.'
  },
  {
    id: 'mostruario-materiais',
    src: '/assets/fotos/cd43ee96e748e739.jpg',
    title: 'Mostruário de Acabamentos',
    caption: 'Expositores com variedade de revestimentos e produtos para acabamento.'
  },
  {
    id: 'acessorios-manuais',
    src: '/assets/fotos/74f5a476537e0aa6.jpg',
    title: 'Ferramentas e Acessórios',
    caption: 'Linha completa de ferramentas manuais para pedreiros, encanadores e pintores.'
  },
  {
    id: 'setor-hidraulica',
    src: '/assets/fotos/149876eca95ce5b6.jpg',
    title: 'Seção de Conexões e Hidráulica',
    caption: 'Tubulações, joelhos, tês e conexões soldáveis e roscáveis para redes hidráulicas.'
  },
  {
    id: 'variedade-reforma',
    src: '/assets/fotos/3299db30aec36ebf.jpg',
    title: 'Variedade para Reformar e Construir',
    caption: 'Itens essenciais para todas as fases da construção civil.'
  }
];

interface ConstruJStoreGalleryProps {
  initialIndex: number | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export const ConstruJStoreGallery: React.FC<ConstruJStoreGalleryProps> = ({
  initialIndex,
  onClose
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex ?? 0);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (initialIndex !== null) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex]);

  const isOpen = initialIndex !== null;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % storePhotos.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + storePhotos.length) % storePhotos.length);
  }, []);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Lock scroll and focus close button
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPhoto = storePhotos[currentIndex];

  return (
    <div
      className="store-gallery-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galeria de fotos da Constru J"
    >
      <div
        ref={modalRef}
        className="store-gallery-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          ref={closeBtnRef}
          type="button"
          className="store-gallery-close-btn"
          onClick={onClose}
          aria-label="Fechar galeria"
        >
          <X size={22} />
        </button>

        {/* Botão Anterior */}
        <button
          type="button"
          className="store-gallery-nav-btn prev"
          onClick={handlePrev}
          aria-label="Foto anterior"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Botão Próximo */}
        <button
          type="button"
          className="store-gallery-nav-btn next"
          onClick={handleNext}
          aria-label="Próxima foto"
        >
          <ChevronRight size={28} />
        </button>

        {/* Container Principal da Imagem */}
        <div className="store-gallery-viewport">
          <AnimatePresence mode="wait">
            {shouldReduceMotion ? (
              <img
                key={currentPhoto.id}
                src={currentPhoto.src}
                alt={currentPhoto.caption}
                className="store-gallery-image"
              />
            ) : (
              <motion.img
                key={currentPhoto.id}
                src={currentPhoto.src}
                alt={currentPhoto.caption}
                className="store-gallery-image"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Rodapé com Legenda Factual e Contador */}
        <div className="store-gallery-caption-bar">
          <div className="store-gallery-caption-text">
            <strong>{currentPhoto.title}</strong>
            <p>{currentPhoto.caption}</p>
          </div>
          <div className="store-gallery-counter" aria-live="polite">
            {currentIndex + 1} de {storePhotos.length}
          </div>
        </div>
      </div>
    </div>
  );
};
