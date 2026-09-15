import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Posições reais do mouse
  const mousePos = useRef({ x: -100, y: -100 });
  // Posições do rastro com interpolação suave (lerp)
  const trailPos = useRef({ x: -100, y: -100 });

  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Detecta se é dispositivo touchscreen (não ativa em celulares/tablets)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Posiciona o ponto principal instantaneamente para precisão máxima
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Verifica se está sobre elemento interativo (botões, links, cards, inputs)
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = !!target.closest(
          'a, button, input, textarea, select, .category-card, .product-card, .chip-btn, .hero-category-chip, .contact-row, .location-visual-card, [role="button"]'
        );
        setIsHoveringInteractive(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    let isRunning = false;

    // Loop de animação sob demanda para o rastro (executa apenas enquanto em movimento)
    const animateTrail = () => {
      const dx = mousePos.current.x - trailPos.current.x;
      const dy = mousePos.current.y - trailPos.current.y;

      // Se a distância for insignificante, suspende o loop para economizar ciclos de CPU/GPU
      if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
        isRunning = false;
        return;
      }

      trailPos.current.x += dx * 0.22;
      trailPos.current.y += dy * 0.22;

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(animateTrail);
    };

    const startAnimation = () => {
      if (!isRunning) {
        isRunning = true;
        requestRef.current = requestAnimationFrame(animateTrail);
      }
    };

    const onMove = (e: MouseEvent) => {
      handleMouseMove(e);
      startAnimation();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  return (
    <div
      className={`custom-cursor-container ${isVisible ? 'visible' : ''} ${
        isHoveringInteractive ? 'hovering' : ''
      } ${isClicking ? 'clicking' : ''}`}
      aria-hidden="true"
    >
      {/* Ponto central (bolinha pequena com brilho glow) */}
      <div ref={dotRef} className="cursor-dot" />

      {/* Rastro orbital externo suave com glow luminoso */}
      <div ref={trailRef} className="cursor-trail" />
    </div>
  );
};
