import React from 'react';
import { ExternalLink } from 'lucide-react';
import { companyData } from '../../data/company';
import { ConstruJReveal } from '../Motion/ConstruJReveal';
import { InteractiveHoverButton } from '../UI/interactive-hover-button';
import { ThiingIllustration } from '../UI/ThiingIllustration';
import './ContactSection.css';

interface ContactSectionProps {
  onOpenQuote: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenQuote }) => {
  return (
    <section id="contato" className="contact-section" aria-labelledby="contact-heading">
      <div className="container">
        <ConstruJReveal yOffset={10}>
          <div className="contact-header">
            <span className="section-eyebrow">Localização e Atendimento</span>
            <h2 id="contact-heading" className="section-title">
              Venha nos visitar
            </h2>
            <p className="section-subtitle">
              Estamos de portas abertas para receber você e apresentar as melhores soluções para a sua construção ou reforma.
            </p>
          </div>
        </ConstruJReveal>

        <div className="contact-grid">
          {/* Card de Informações Oficiais com Ilustrações 3D Thiings */}
          <ConstruJReveal delay={0.06} yOffset={14}>
            <div className="contact-info-card">
              {/* Endereço com Location Pin 3D */}
              <div className="contact-row">
                <div className="contact-icon-wrapper">
                  <ThiingIllustration
                    name="location-pin"
                    size={58}
                    alt=""
                    className="contact-thiing-asset"
                  />
                </div>
                <div className="contact-details">
                  <h3>Endereço</h3>
                  <p>{companyData.endereco.logradouro}, {companyData.endereco.numero}</p>
                  <p>{companyData.endereco.bairro} • {companyData.cidade} – {companyData.estado}</p>
                  <p className="contact-note">CEP {companyData.endereco.cep}</p>
                </div>
              </div>

              {/* WhatsApp com Smartphone 3D */}
              <div className="contact-row">
                <div className="contact-icon-wrapper">
                  <ThiingIllustration
                    name="smartphone"
                    size={58}
                    alt=""
                    className="contact-thiing-asset"
                  />
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

              {/* Horários com Wall Clock 3D */}
              <div className="contact-row">
                <div className="contact-icon-wrapper">
                  <ThiingIllustration
                    name="wall-clock"
                    size={58}
                    alt=""
                    className="contact-thiing-asset"
                  />
                </div>
                <div className="contact-details">
                  <h3>Horário de Funcionamento</h3>
                  <p><strong>Segunda a sexta:</strong> {companyData.horarios.segundaASexta}</p>
                  <p><strong>Sábado:</strong> {companyData.horarios.sabado}</p>
                  <p><strong>Domingo:</strong> {companyData.horarios.domingo}</p>
                </div>
              </div>
            </div>
          </ConstruJReveal>

          {/* Card de Localização com Mapa Real Interativo do Google Maps */}
          <ConstruJReveal delay={0.12} yOffset={14}>
            <div className="location-map-card">
              {/* Badge superior com identificação da loja */}
              <div className="location-map-badge-top">
                <span className="location-map-dot-pulse" aria-hidden="true" />
                <span>Loja Física Constru J</span>
                <span className="location-map-tag-city">• {companyData.cidade}–{companyData.estado}</span>
              </div>

              {/* Iframe oficial do Google Maps com a localização exata */}
              <div className="location-map-iframe-wrapper">
                <iframe
                  title="Localização oficial da Constru J no Google Maps"
                  src="https://maps.google.com/maps?q=Constru+J+-+R.+T%C3%A1cito+de+Freitas+Costa,+414+-+Cid+Alta,+Rio+Pardo+de+Minas+-+MG,+39530-000&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="real-google-map-iframe"
                />
              </div>

              {/* Barra inferior flutuante com endereço real e botão de Como Chegar */}
              <div className="location-map-footer-overlay">
                <div className="location-map-footer-text">
                  <strong>{companyData.endereco.logradouro}, {companyData.endereco.numero}</strong>
                  <span>{companyData.endereco.bairro} — {companyData.cidade}/{companyData.estado}</span>
                </div>

                <a
                  href={companyData.mapaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-como-chegar"
                  id="btn-como-chegar"
                  aria-label="Abrir rota no Google Maps"
                >
                  <span>Como chegar</span>
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </ConstruJReveal>
        </div>

        {/* CTA Banner "Vamos começar sua obra?" com Clipboard 3D */}
        <ConstruJReveal delay={0.15} yOffset={12}>
          <div className="cta-banner">
            <div className="cta-banner-content">
              <div className="cta-banner-left">
                <ThiingIllustration
                  name="clipboard"
                  size={96}
                  alt=""
                  className="cta-clipboard-asset"
                />
                <div className="cta-banner-title">
                  Vamos começar sua obra?
                </div>
              </div>

              <InteractiveHoverButton
                variant="primary"
                onClick={onOpenQuote}
                id="btn-cta-pedir-orcamento"
                text="Pedir orçamento"
                aria-label="Pedir orçamento agora"
              />
            </div>
          </div>
        </ConstruJReveal>
      </div>
    </section>
  );
};
