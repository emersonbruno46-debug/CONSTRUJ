import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { companyData } from '../../data/company';
import './ContactSection.css';

interface ContactSectionProps {
  onOpenQuote: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenQuote }) => {
  return (
    <section id="contato" className="contact-section" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-header">
          <span className="section-eyebrow">Localização e Atendimento</span>
          <h2 id="contact-heading" className="section-title">
            Venha nos visitar
          </h2>
          <p className="section-subtitle">
            Estamos de portas abertas para receber você e apresentar as melhores soluções para a sua construção ou reforma.
          </p>
        </div>

        <div className="contact-grid">
          {/* Card de Informações Oficiais */}
          <div className="contact-info-card">
            {/* Endereço */}
            <div className="contact-row">
              <div className="contact-icon-wrapper" aria-hidden="true">
                <MapPin size={22} />
              </div>
              <div className="contact-details">
                <h3>Endereço</h3>
                <p>{companyData.endereco.logradouro}, {companyData.endereco.numero}</p>
                <p>{companyData.endereco.bairro} • {companyData.cidade} – {companyData.estado}</p>
                <p className="contact-note">CEP {companyData.endereco.cep}</p>
              </div>
            </div>

            {/* WhatsApp e Telefone */}
            <div className="contact-row">
              <div className="contact-icon-wrapper" aria-hidden="true">
                <MessageCircle size={22} />
              </div>
              <div className="contact-details">
                <h3>WhatsApp e Atendimento</h3>
                <p>
                  <a
                    href={companyData.whatsapp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    {companyData.whatsapp.exibicao}
                  </a>
                </p>
                <p className="contact-note">Clique para abrir conversa direta no aplicativo</p>
              </div>
            </div>

            {/* Horários */}
            <div className="contact-row">
              <div className="contact-icon-wrapper" aria-hidden="true">
                <Clock size={22} />
              </div>
              <div className="contact-details">
                <h3>Horário de Funcionamento</h3>
                <p><strong>Segunda a sexta:</strong> {companyData.horarios.segundaASexta}</p>
                <p><strong>Sábado:</strong> {companyData.horarios.sabado}</p>
                <p><strong>Domingo:</strong> {companyData.horarios.domingo}</p>
              </div>
            </div>
          </div>

          {/* Card de Como Chegar com link para o mapa oficial */}
          <div className="location-visual-card">
            <div className="location-radar-circle">
              <div className="location-pin-inner" aria-hidden="true">
                <MapPin size={28} />
              </div>
            </div>

            <div className="location-city-name">{companyData.cidade}</div>
            <div className="location-state-sub">
              {companyData.endereco.bairro} • {companyData.estado}
            </div>

            <a
              href={companyData.mapaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-como-chegar"
              id="btn-como-chegar"
            >
              <span>Como chegar</span>
              <ExternalLink size={18} aria-hidden="true" />
            </a>

            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Destino verificado no Google Maps
            </div>
          </div>
        </div>

        {/* CTA Banner "Vamos começar sua obra?" */}
        <div className="cta-banner">
          <div className="cta-banner-content">
            <div className="cta-banner-title">
              Vamos começar sua obra?
            </div>

            <button
              type="button"
              className="btn btn-white"
              onClick={onOpenQuote}
              id="btn-cta-pedir-orcamento"
            >
              <span>Pedir orçamento</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
