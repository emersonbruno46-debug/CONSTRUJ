import React, { useState, useEffect } from 'react';
import { MapPin, FileText, Menu, X } from 'lucide-react';
import { companyData } from '../../data/company';
import './Header.css';

interface HeaderProps {
  quoteCount: number;
  onOpenQuote: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  quoteCount,
  onOpenQuote,
  activeSection
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: 'Início', href: '#inicio', id: 'inicio' },
    { label: 'Catálogo', href: '#catalogo', id: 'catalogo' },
    { label: 'Nossa loja', href: '#loja', id: 'loja' },
    { label: 'Contato', href: '#contato', id: 'contato' }
  ];

  return (
    <header className="site-header">
      {/* Top Bar verde discreta */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-location">
            <MapPin size={14} aria-hidden="true" />
            <span>{companyData.cidade} • {companyData.estado}</span>
          </div>
          <div className="top-bar-slogan">
            <span>Qualidade para a sua obra, sempre mais perto de você.</span>
          </div>
        </div>
      </div>

      {/* Main Header com Logo oficial e links */}
      <div className="main-header">
        <div className="container header-container">
          {/* Logo Oficial Constru J */}
          <a href="#inicio" className="brand-logo-link" aria-label="Constru J - Voltar para o início">
            <img
              src="/logo-constru-j.svg"
              alt="Constru J — A mais completa e preferida"
              className="brand-logo-img"
              width="240"
              height="56"
            />
          </a>

          {/* Navegação Desktop */}
          <nav className="nav-desktop" aria-label="Navegação principal">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Botões de Ação */}
          <div className="header-actions">
            <button
              type="button"
              className="btn-quote-header"
              onClick={onOpenQuote}
              aria-label={`Meu orçamento com ${quoteCount} ${quoteCount === 1 ? 'item' : 'itens'}`}
            >
              <FileText size={18} aria-hidden="true" />
              <span>Meu orçamento</span>
              {quoteCount > 0 && (
                <span className="quote-count-badge" aria-hidden="true">
                  {quoteCount}
                </span>
              )}
            </button>

            {/* Botão Hambúrguer Mobile */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Abrir menu de navegação"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer do Menu Mobile */}
      {isMobileMenuOpen && (
        <>
          <div
            className="mobile-nav-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Menu de navegação">
            <div className="mobile-nav-header">
              <img
                src="/logo-constru-j.svg"
                alt="Constru J"
                className="brand-logo-img"
                style={{ height: '40px' }}
              />
              <button
                type="button"
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mobile-nav-links" aria-label="Navegação móvel">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenQuote();
                }}
              >
                <FileText size={18} />
                <span>Ver meu orçamento {quoteCount > 0 ? `(${quoteCount})` : ''}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
