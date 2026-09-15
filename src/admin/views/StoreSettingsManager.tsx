import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Instagram,
  Check,
  Eye,
  AlertCircle
} from 'lucide-react';
import { getStoreSettings, saveStoreSettings } from '../../services/db';
import { StoreSettingsAdmin } from '../../types/admin';
import { getCurrentUser } from '../../services/auth';

export const StoreSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettingsAdmin | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const currentUser = getCurrentUser() || { nome: 'Administrador', email: 'admin@construj.com.br' };

  useEffect(() => {
    async function load() {
      const data = await getStoreSettings();
      setSettings(data);
    }
    load();
  }, []);

  if (!settings) {
    return <div className="admin-loading-box">Carregando dados da loja...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    // Validação básica do WhatsApp
    const rawNumber = settings.whatsapp?.numeroLimpo?.replace(/\D/g, '') || '';
    if (rawNumber.length < 10 || rawNumber.length > 11) {
      setPhoneError('Número de WhatsApp inválido. Digite DDD + número (10 ou 11 dígitos).');
      return;
    }

    setSaving(true);
    try {
      const updatedWhatsapp = {
        ...settings.whatsapp,
        numeroLimpo: rawNumber,
        internacional: `55${rawNumber}`,
        link: `https://wa.me/55${rawNumber}`
      };

      await saveStoreSettings({ ...settings, whatsapp: updatedWhatsapp }, currentUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  // Montagem da Prévia não-destrutiva da Mensagem do WhatsApp
  const sampleQuoteItems = [
    '• 2x Cimento CP II-Z-32 50kg (CJ-CIM-01) - 50kg',
    '• 15m² Porcelanato Esmaltado 84x84 (CJ-PORC-02) - Acetinado'
  ];
  const sampleMessagePreview = `${settings.quoteInitialMessage || 'Olá, Constru-J!'}\n\n${sampleQuoteItems.join('\n')}\n\nTotal estimado: 17 itens selecionados.`;

  return (
    <div className="admin-view-container">
      {/* Cabeçalho */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-page-title">Dados e Horários da Loja</h1>
          <p className="admin-page-desc">
            Informações institucionais oficiais, canais de atendimento, endereço e horários de funcionamento.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          disabled={saving}
          onClick={handleSave}
        >
          <Check size={18} />
          <span>{saving ? 'Gravando...' : success ? 'Salvo com Sucesso!' : 'Salvar Dados'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="admin-settings-form">
        {/* Bloco 1: Identificação e Atendimento */}
        <div className="admin-card-section">
          <div className="admin-sec-title-group">
            <MessageCircle size={20} className="admin-sec-icon" />
            <h2 className="admin-section-title">Contatos e Atendimento WhatsApp</h2>
          </div>

          {phoneError && (
            <div className="admin-modal-alert">
              <AlertCircle size={18} />
              <span>{phoneError}</span>
            </div>
          )}

          <div className="admin-form-grid">
            <div>
              <label className="admin-label required">Nome Comercial</label>
              <input
                type="text"
                className="admin-form-input"
                value={settings.nome || ''}
                onChange={(e) => setSettings({ ...settings, nome: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Slogan Oficial</label>
              <input
                type="text"
                className="admin-form-input"
                value={settings.slogan || ''}
                onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label required">WhatsApp Oficial (com DDD)</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="(38) 99121-4662"
                value={settings.whatsapp?.exibicao || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whatsapp: {
                      ...settings.whatsapp,
                      exibicao: e.target.value,
                      numeroLimpo: e.target.value.replace(/\D/g, '')
                    }
                  })
                }
              />
            </div>

            <div>
              <label className="admin-label">Telefone Fixo / Alternativo</label>
              <input
                type="text"
                className="admin-form-input"
                value={settings.telefone || ''}
                onChange={(e) => setSettings({ ...settings, telefone: e.target.value })}
              />
            </div>

            <div className="admin-form-col-span-2">
              <label className="admin-label">Instagram (@ da loja)</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="@construj_"
                value={settings.instagram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    instagram: e.target.value,
                    instagramUrl: `https://instagram.com/${e.target.value.replace('@', '')}`
                  })
                }
              />
            </div>

            <div className="admin-form-col-span-2">
              <label className="admin-label">Mensagem Inicial do Orçamento no WhatsApp</label>
              <textarea
                rows={2}
                className="admin-form-textarea"
                value={settings.quoteInitialMessage || ''}
                onChange={(e) =>
                  setSettings({ ...settings, quoteInitialMessage: e.target.value })
                }
              />
            </div>
          </div>

          {/* Prévia da Mensagem do Orçamento */}
          <div className="admin-message-preview-box">
            <div className="admin-preview-badge">
              <Eye size={14} />
              <span>Prévia do texto que chega no WhatsApp da loja:</span>
            </div>
            <pre className="admin-preview-text">{sampleMessagePreview}</pre>
          </div>
        </div>

        {/* Bloco 2: Endereço Físico e Localização */}
        <div className="admin-card-section">
          <div className="admin-sec-title-group">
            <MapPin size={20} className="admin-sec-icon" />
            <h2 className="admin-section-title">Endereço da Loja Física</h2>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-col-span-2">
              <label className="admin-label required">Endereço Completo</label>
              <input
                type="text"
                className="admin-form-input"
                value={settings.endereco?.completo || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    endereco: { ...settings.endereco, completo: e.target.value }
                  })
                }
              />
            </div>

            <div>
              <label className="admin-label">Cidade</label>
              <input
                type="text"
                className="admin-form-input"
                value={settings.cidade || ''}
                onChange={(e) => setSettings({ ...settings, cidade: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Estado (UF)</label>
              <input
                type="text"
                className="admin-form-input"
                value={settings.estado || ''}
                onChange={(e) => setSettings({ ...settings, estado: e.target.value })}
              />
            </div>

            <div className="admin-form-col-span-2">
              <label className="admin-label">Link do Google Maps</label>
              <input
                type="url"
                className="admin-form-input"
                placeholder="https://maps.app.goo.gl/..."
                value={settings.mapaLink || ''}
                onChange={(e) => setSettings({ ...settings, mapaLink: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Horários de Atendimento */}
        <div className="admin-card-section">
          <div className="admin-sec-title-group">
            <Clock size={20} className="admin-sec-icon" />
            <h2 className="admin-section-title">Horários de Atendimento</h2>
          </div>

          <div className="admin-form-grid">
            <div>
              <label className="admin-label">Segunda a Sexta-feira</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="07:00 às 17:00"
                value={settings.horarios?.segundaASexta || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    horarios: { ...settings.horarios, segundaASexta: e.target.value }
                  })
                }
              />
            </div>

            <div>
              <label className="admin-label">Sábado</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="07:00 às 12:00"
                value={settings.horarios?.sabado || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    horarios: { ...settings.horarios, sabado: e.target.value }
                  })
                }
              />
            </div>

            <div>
              <label className="admin-label">Domingo e Feriados</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Fechado"
                value={settings.horarios?.domingo || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    horarios: { ...settings.horarios, domingo: e.target.value }
                  })
                }
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
