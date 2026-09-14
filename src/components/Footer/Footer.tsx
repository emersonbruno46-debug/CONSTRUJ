import React from 'react';
import { CreditCard } from 'lucide-react';
import { companyData } from '../../data/company';
import './Footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        {/* Linha Superior: Logo e Meios de Pagamento no Balcão */}
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-logo-badge">
              <img
                src="/logo-constru-j.svg"
                alt="Constru J — A mais completa e preferida"
                className="footer-logo-img"
                width="200"
                height="44"
              />
            </div>
            <div className="footer-slogan">
              {companyData.slogan} • {companyData.cidade}–{companyData.estado}
            </div>
          </div>

          <div className="footer-payments-col">
            <CreditCard size={32} className="footer-payment-icon" aria-hidden="true" />
            <div className="footer-payment-text">
              <h4>{companyData.pagamentoNoAtendimento.join(' • ')}</h4>
              <p>Formas de pagamento aceitas no atendimento da loja física</p>
            </div>
          </div>
        </div>

        {/* Linha Inferior: Navegação rápida e Direitos */}
        <div className="footer-bottom-row">
          <p>© {currentYear} {companyData.nome}. Todos os direitos reservados.</p>

          <nav className="footer-nav-links" aria-label="Links rápidos do rodapé">
            <a href="#inicio">Início</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#loja">Nossa loja</a>
            <a href="#contato">Contato</a>
          </nav>

          <p>Rio Pardo de Minas – MG</p>
        </div>
      </div>
    </footer>
  );
};
