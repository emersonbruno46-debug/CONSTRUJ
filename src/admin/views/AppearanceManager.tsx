import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Star,
  Image as ImageIcon,
  Bell,
  Upload,
  Check,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import {
  getSiteAppearance,
  saveSiteAppearance,
  getProducts,
  getStoreSettings,
  saveStoreSettings
} from '../../services/db';
import { uploadImage } from '../../services/storage';
import {
  SiteAppearanceAdmin,
  ProductAdmin,
  GalleryPhoto,
  AnnouncementBanner
} from '../../types/admin';
import { getCurrentUser } from '../../services/auth';

export const AppearanceManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'featured' | 'gallery' | 'notice'>('hero');
  const [appearance, setAppearance] = useState<SiteAppearanceAdmin | null>(null);
  const [allProducts, setAllProducts] = useState<ProductAdmin[]>([]);
  const [announcement, setAnnouncement] = useState<AnnouncementBanner>({
    ativo: false,
    texto: ''
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const currentUser = getCurrentUser() || { nome: 'Administrador', email: 'admin@construj.com.br' };

  useEffect(() => {
    async function loadData() {
      const [app, prods, settings] = await Promise.all([
        getSiteAppearance(),
        getProducts(true),
        getStoreSettings()
      ]);
      setAppearance(app);
      setAllProducts(prods);
      if (settings.announcementBanner) {
        setAnnouncement(settings.announcementBanner);
      }
    }
    loadData();
  }, []);

  if (!appearance) {
    return <div className="admin-loading-box">Carregando configurações de aparência...</div>;
  }

  // Upload de Banner/Foto do Hero
  const handleHeroPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(15);
      const res = await uploadImage(file, (p) => setUploadProgress(p));
      setAppearance((prev) => (prev ? { ...prev, heroFacadeImage: res.url } : null));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadProgress(null);
    }
  };

  // Upload de Fotos da Galeria da Loja
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImage(file);
        const newPhoto: GalleryPhoto = {
          id: `gal_${Date.now()}_${i}`,
          url: res.url,
          titulo: file.name.split('.')[0].replace(/[-_]/g, ' '),
          legenda: 'Estrutura oficial Constru-J',
          alt: file.name,
          ordem: (appearance.galleryPhotos?.length || 0) + 1
        };

        setAppearance((prev) =>
          prev
            ? {
                ...prev,
                galleryPhotos: [...(prev.galleryPhotos || []), newPhoto]
              }
            : null
        );
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Salvar Alterações
  const handleSaveAll = async () => {
    if (!appearance) return;
    setSaving(true);

    try {
      await saveSiteAppearance(appearance, currentUser);
      await saveStoreSettings({ announcementBanner: announcement }, currentUser);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle de Produto Destacado
  const toggleFeaturedProduct = (id: string) => {
    if (!appearance) return;
    const current = appearance.featuredProductIds || [];
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setAppearance({ ...appearance, featuredProductIds: updated });
  };

  return (
    <div className="admin-view-container">
      {/* Cabeçalho */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-page-title">Aparência do Site</h1>
          <p className="admin-page-desc">
            Edite os textos de abertura, produtos em destaque na home, galeria de fotos e avisos.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          disabled={saving}
          onClick={handleSaveAll}
        >
          <Check size={18} />
          <span>{saving ? 'Gravando...' : saveSuccess ? 'Alterações Salvas!' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Navegação por Abas */}
      <div className="admin-tabs-nav">
        <button
          type="button"
          className={`admin-tab-item ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          <Sparkles size={18} />
          <span>1. Abertura (Hero)</span>
        </button>
        <button
          type="button"
          className={`admin-tab-item ${activeTab === 'featured' ? 'active' : ''}`}
          onClick={() => setActiveTab('featured')}
        >
          <Star size={18} />
          <span>2. Produtos em Destaque ({appearance.featuredProductIds?.length || 0})</span>
        </button>
        <button
          type="button"
          className={`admin-tab-item ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <ImageIcon size={18} />
          <span>3. Galeria da Loja ({appearance.galleryPhotos?.length || 0})</span>
        </button>
        <button
          type="button"
          className={`admin-tab-item ${activeTab === 'notice' ? 'active' : ''}`}
          onClick={() => setActiveTab('notice')}
        >
          <Bell size={18} />
          <span>4. Aviso Temporário</span>
        </button>
      </div>

      <div className="admin-card-section" style={{ marginTop: 20 }}>
        {/* ABA 1: HERO / ABERTURA */}
        {activeTab === 'hero' && (
          <div className="admin-form-grid">
            <div>
              <label className="admin-label">Eyebrow (Linha Superior)</label>
              <input
                type="text"
                className="admin-form-input"
                value={appearance.heroEyebrow}
                onChange={(e) => setAppearance({ ...appearance, heroEyebrow: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Título Principal (Headline)</label>
              <input
                type="text"
                className="admin-form-input"
                value={appearance.heroHeadline}
                onChange={(e) => setAppearance({ ...appearance, heroHeadline: e.target.value })}
              />
            </div>

            <div className="admin-form-col-span-2">
              <label className="admin-label">Texto de Apoio (Subtítulo)</label>
              <textarea
                rows={2}
                className="admin-form-textarea"
                value={appearance.heroSubtitle}
                onChange={(e) => setAppearance({ ...appearance, heroSubtitle: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Texto do Botão Principal</label>
              <input
                type="text"
                className="admin-form-input"
                value={appearance.heroBtnPrimaryText}
                onChange={(e) => setAppearance({ ...appearance, heroBtnPrimaryText: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Texto do Botão Secundário</label>
              <input
                type="text"
                className="admin-form-input"
                value={appearance.heroBtnSecondaryText}
                onChange={(e) =>
                  setAppearance({ ...appearance, heroBtnSecondaryText: e.target.value })
                }
              />
            </div>

            <div className="admin-form-col-span-2">
              <label className="admin-label">Foto Principal da Fachada</label>
              <div className="admin-photo-preview-row">
                <img
                  src={appearance.heroFacadeImage}
                  alt="Fachada Hero"
                  className="admin-main-preview-img"
                />
                <div className="admin-photo-upload-actions">
                  <label className="admin-btn-upload-file">
                    <Upload size={16} />
                    <span>Substituir Fotografia da Fachada</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroPhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {uploadProgress !== null && (
                    <span className="admin-upload-progress">Enviando: {uploadProgress}%</span>
                  )}
                  <input
                    type="text"
                    className="admin-form-input"
                    value={appearance.heroFacadeImage}
                    onChange={(e) =>
                      setAppearance({ ...appearance, heroFacadeImage: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: PRODUTOS EM DESTAQUE NA HOME */}
        {activeTab === 'featured' && (
          <div>
            <p className="admin-tab-info-text">
              Marque os produtos que devem aparecer em posição de destaque na página inicial.
              Produtos rascunho ou ocultos exibem aviso automático de atenção.
            </p>

            <div className="admin-featured-products-picker">
              {allProducts.map((p) => {
                const isSelected = appearance.featuredProductIds?.includes(p.id);
                const isHiddenOrDraft = p.status !== 'published' || !p.ativo;

                return (
                  <div
                    key={p.id}
                    className={`admin-featured-picker-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleFeaturedProduct(p.id)}
                  >
                    <img
                      src={p.imagem}
                      alt={p.nome}
                      className="admin-picker-thumb"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/produtos/placeholder.webp';
                      }}
                    />
                    <div className="admin-picker-info">
                      <span className="admin-picker-name">{p.nome}</span>
                      <span className="admin-picker-cat">{p.categoriaNome} • {p.codigo}</span>
                      {isSelected && isHiddenOrDraft && (
                        <div className="admin-featured-warning">
                          <AlertCircle size={14} />
                          <span>Atenção: Este item está oculto/rascunho</span>
                        </div>
                      )}
                    </div>
                    <div className="admin-picker-check">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        aria-label="Selecionar para destaque"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ABA 3: GALERIA DA LOJA */}
        {activeTab === 'gallery' && (
          <div>
            <div className="admin-additional-header">
              <span className="admin-section-subtitle">
                Fotos do Showroom e Estrutura ({appearance.galleryPhotos?.length || 0})
              </span>
              <label className="admin-btn-secondary">
                <Upload size={16} />
                <span>Adicionar Fotos à Galeria</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="admin-gallery-edit-list">
              {appearance.galleryPhotos?.map((photo, idx) => (
                <div key={photo.id} className="admin-gallery-edit-row">
                  <img src={photo.url} alt={photo.alt} className="admin-gallery-thumb" />
                  <div className="admin-gallery-inputs">
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Título da foto (ex: Showroom de Pisos)"
                      value={photo.titulo}
                      onChange={(e) => {
                        const list = [...appearance.galleryPhotos];
                        list[idx].titulo = e.target.value;
                        setAppearance({ ...appearance, galleryPhotos: list });
                      }}
                    />
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Legenda descritiva para o cliente..."
                      value={photo.legenda || ''}
                      onChange={(e) => {
                        const list = [...appearance.galleryPhotos];
                        list[idx].legenda = e.target.value;
                        setAppearance({ ...appearance, galleryPhotos: list });
                      }}
                    />
                  </div>
                  <div className="admin-gallery-order-actions">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const list = [...appearance.galleryPhotos];
                        const [item] = list.splice(idx, 1);
                        list.splice(idx - 1, 0, item);
                        setAppearance({ ...appearance, galleryPhotos: list });
                      }}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === appearance.galleryPhotos.length - 1}
                      onClick={() => {
                        const list = [...appearance.galleryPhotos];
                        const [item] = list.splice(idx, 1);
                        list.splice(idx + 1, 0, item);
                        setAppearance({ ...appearance, galleryPhotos: list });
                      }}
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      className="text-red"
                      onClick={() => {
                        setAppearance({
                          ...appearance,
                          galleryPhotos: appearance.galleryPhotos.filter((_, i) => i !== idx)
                        });
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA 4: AVISO TEMPORÁRIO (FERIADOS / COMUNICADOS) */}
        {activeTab === 'notice' && (
          <div className="admin-form-grid">
            <div className="admin-form-col-span-2">
              <label className="admin-checkbox-card">
                <input
                  type="checkbox"
                  checked={announcement.ativo}
                  onChange={(e) => setAnnouncement({ ...announcement, ativo: e.target.checked })}
                />
                <div>
                  <strong>Ativar Barra de Aviso no Topo do Site</strong>
                  <span>Exibe uma faixa comemorativa, aviso de feriado ou comunicado no topo</span>
                </div>
              </label>
            </div>

            <div className="admin-form-col-span-2">
              <label className="admin-label required">Texto do Comunicado</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Ex: Atendimento em horário especial no feriado municipal: 08:00 às 12:00."
                value={announcement.texto}
                onChange={(e) => setAnnouncement({ ...announcement, texto: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Data de Início (Opcional)</label>
              <input
                type="datetime-local"
                className="admin-form-input"
                value={announcement.inicio || ''}
                onChange={(e) => setAnnouncement({ ...announcement, inicio: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Data de Término (Expiração Automática)</label>
              <input
                type="datetime-local"
                className="admin-form-input"
                value={announcement.termino || ''}
                onChange={(e) => setAnnouncement({ ...announcement, termino: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
