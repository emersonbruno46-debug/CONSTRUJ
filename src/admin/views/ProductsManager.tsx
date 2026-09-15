import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Eye,
  Star,
  Layers,
  Upload,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  getProducts,
  getCategories,
  saveProduct,
  deleteProduct,
  duplicateProduct,
  batchUpdateProducts
} from '../../services/db';
import { uploadImage } from '../../services/storage';
import { ProductAdmin, CategoryAdmin, ProductStatus, AdditionalPhoto } from '../../types/admin';
import { ProductVariant } from '../../types/catalog';
import { getCurrentUser } from '../../services/auth';

export const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [categories, setCategories] = useState<CategoryAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Seleção em lote
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchCategory, setBatchCategory] = useState<string>('');
  const [batchStatus, setBatchStatus] = useState<string>('');

  // Modal de edição / criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductAdmin> | null>(null);
  const [modalTab, setModalTab] = useState<'info' | 'photos' | 'variants' | 'specs'>('info');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Variantes em edição
  const [variantsList, setVariantsList] = useState<ProductVariant[]>([]);
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantDetail, setNewVariantDetail] = useState('');

  // Especificações em edição
  const [specsList, setSpecsList] = useState<{ chave: string; valor: string }[]>([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Fotos adicionais
  const [photosList, setPhotosList] = useState<AdditionalPhoto[]>([]);

  const currentUser = getCurrentUser() || { nome: 'Administrador', email: 'admin@construj.com.br' };

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([getProducts(true), getCategories(true)]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtragem
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'all' || p.categoria === selectedCategoryFilter;

    const matchesStatus =
      selectedStatusFilter === 'all' || p.status === selectedStatusFilter;

    const matchesFeatured = !featuredOnly || p.isFeatured;

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  });

  // Abrir Modal para Criar
  const handleOpenCreate = () => {
    setEditingProduct({
      nome: '',
      codigo: `CJ-${Math.floor(1000 + Math.random() * 9000)}`,
      categoria: categories[0]?.id as any || 'basicos',
      categoriaNome: categories[0]?.nome || 'Materiais básicos',
      descricao: '',
      unidade: 'un',
      permiteDecimal: false,
      quantidadeMinima: 1,
      incremento: 1,
      imagem: '/assets/produtos/placeholder.webp',
      alt: '',
      marca: '',
      status: 'published',
      isFeatured: false,
      demonstrativo: true
    });
    setVariantsList([]);
    setSpecsList([]);
    setPhotosList([]);
    setModalTab('info');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Abrir Modal para Editar
  const handleOpenEdit = (prod: ProductAdmin) => {
    setEditingProduct({ ...prod });
    setVariantsList(prod.variantes ? [...prod.variantes] : []);
    setSpecsList(prod.especificacoes ? [...prod.especificacoes] : []);
    setPhotosList(prod.fotosAdicionais ? [...prod.fotosAdicionais] : []);
    setModalTab('info');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Duplicar
  const handleDuplicate = async (id: string) => {
    try {
      await duplicateProduct(id, currentUser);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Excluir
  const handleDelete = async (id: string) => {
    if (confirm('Deseja mover este produto para a lixeira?')) {
      await deleteProduct(id, currentUser, false);
      await loadData();
    }
  };

  // Upload da Imagem Principal
  const handleMainPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(10);
      const res = await uploadImage(file, (p) => setUploadProgress(p));
      setEditingProduct((prev) => (prev ? { ...prev, imagem: res.url } : null));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadProgress(null);
    }
  };

  // Upload de Foto Adicional
  const handleAdditionalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImage(file);
        setPhotosList((prev) => [
          ...prev,
          {
            id: `photo_${Date.now()}_${i}`,
            url: res.url,
            legenda: file.name.split('.')[0],
            alt: file.name,
            ordem: prev.length + 1
          }
        ]);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Salvar Produto (com validação condicional para rascunho vs publicado)
  const handleSave = async (forceStatus?: ProductStatus) => {
    if (!editingProduct) return;
    setFormError(null);

    const targetStatus = forceStatus || editingProduct.status || 'draft';

    // Regra: se for publicar, exige campos obrigatórios (nome, código, categoria)
    if (targetStatus === 'published') {
      if (!editingProduct.nome || editingProduct.nome.trim().length < 2) {
        setFormError('O nome do produto é obrigatório para publicação.');
        setModalTab('info');
        return;
      }
      if (!editingProduct.codigo || editingProduct.codigo.trim().length === 0) {
        setFormError('O código de referência é obrigatório para publicação.');
        setModalTab('info');
        return;
      }
    }

    setSaving(true);

    try {
      const selectedCatInfo = categories.find((c) => c.id === editingProduct.categoria);

      await saveProduct(
        {
          ...editingProduct,
          categoriaNome: selectedCatInfo?.nome || String(editingProduct.categoria),
          status: targetStatus,
          variantes: variantsList,
          especificacoes: specsList,
          fotosAdicionais: photosList
        } as any,
        currentUser
      );

      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar produto.');
    } finally {
      setSaving(false);
    }
  };

  // Seleção em lote
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyBatchActions = async () => {
    if (selectedIds.length === 0) return;

    const updates: Partial<ProductAdmin> = {};
    if (batchStatus) {
      updates.status = batchStatus as ProductStatus;
    }
    if (batchCategory) {
      updates.categoria = batchCategory as any;
      const cat = categories.find((c) => c.id === batchCategory);
      if (cat) updates.categoriaNome = cat.nome;
    }

    if (Object.keys(updates).length === 0) {
      alert('Selecione uma ação para aplicar.');
      return;
    }

    try {
      await batchUpdateProducts(selectedIds, updates, currentUser);
      setSelectedIds([]);
      setBatchStatus('');
      setBatchCategory('');
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-view-container">
      {/* Cabeçalho */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-page-title">Catálogo de Produtos</h1>
          <p className="admin-page-desc">
            Gerencie os itens disponíveis no catálogo, fotos, variantes e situação de publicação.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleOpenCreate}
        >
          <Plus size={18} />
          <span>Novo produto</span>
        </button>
      </div>

      {/* Controles e Filtros */}
      <div className="admin-filters-card">
        <div className="admin-search-bar">
          <Search size={18} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome do produto ou código de referência..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-selectors">
          <div className="admin-filter-field">
            <label>Categoria:</label>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="all">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-filter-field">
            <label>Situação:</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="published">Publicado</option>
              <option value="draft">Rascunho</option>
              <option value="hidden">Oculto</option>
            </select>
          </div>

          <label className="admin-checkbox-filter">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
            />
            <span>Somente destaques na Home</span>
          </label>
        </div>
      </div>

      {/* Barra de Ações em Lote */}
      {selectedIds.length > 0 && (
        <div className="admin-batch-bar">
          <span className="admin-batch-count">
            {selectedIds.length} produto(s) selecionado(s)
          </span>

          <div className="admin-batch-controls">
            <select
              value={batchStatus}
              onChange={(e) => setBatchStatus(e.target.value)}
            >
              <option value="">Alterar situação...</option>
              <option value="published">Publicar selecionados</option>
              <option value="draft">Mover para rascunho</option>
              <option value="hidden">Ocultar do público</option>
            </select>

            <select
              value={batchCategory}
              onChange={(e) => setBatchCategory(e.target.value)}
            >
              <option value="">Mudar categoria...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="admin-btn-action-apply"
              onClick={handleApplyBatchActions}
            >
              Aplicar em lote
            </button>
            <button
              type="button"
              className="admin-btn-action-cancel"
              onClick={() => setSelectedIds([])}
            >
              Cancelar seleção
            </button>
          </div>
        </div>
      )}

      {/* Tabela de Listagem */}
      <div className="admin-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <button
                  type="button"
                  className="admin-btn-check-all"
                  onClick={toggleSelectAll}
                  aria-label="Selecionar todos"
                >
                  {selectedIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                    <CheckSquare size={18} className="text-green" />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
              </th>
              <th>Foto & Produto</th>
              <th>Código</th>
              <th>Categoria</th>
              <th>Unidade</th>
              <th>Situação</th>
              <th>Destaque</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>
                  Nenhum produto encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => {
                const isSelected = selectedIds.includes(prod.id);
                return (
                  <tr key={prod.id} className={isSelected ? 'row-selected' : ''}>
                    <td>
                      <button
                        type="button"
                        className="admin-btn-check-row"
                        onClick={() => toggleSelectOne(prod.id)}
                      >
                        {isSelected ? (
                          <CheckSquare size={18} className="text-green" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </td>
                    <td>
                      <div className="admin-prod-cell">
                        <img
                          src={prod.imagem}
                          alt={prod.nome}
                          className="admin-prod-thumb"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/produtos/placeholder.webp';
                          }}
                        />
                        <div className="admin-prod-cell-info">
                          <span className="admin-prod-cell-name">{prod.nome}</span>
                          {prod.marca && (
                            <span className="admin-prod-cell-brand">{prod.marca}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-code-badge">{prod.codigo}</span>
                    </td>
                    <td>
                      <span className="admin-cat-pill">{prod.categoriaNome}</span>
                    </td>
                    <td>
                      <span className="admin-unit-text">{prod.unidade}</span>
                    </td>
                    <td>
                      <span className={`admin-status-badge ${prod.status}`}>
                        {prod.status === 'published' && 'Publicado'}
                        {prod.status === 'draft' && 'Rascunho'}
                        {prod.status === 'hidden' && 'Oculto'}
                      </span>
                    </td>
                    <td>
                      {prod.isFeatured ? (
                        <span className="admin-featured-star active" title="Destaque na Home">
                          ★ Sim
                        </span>
                      ) : (
                        <span className="admin-featured-star muted">Não</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-action-icon-btn"
                          title="Editar"
                          onClick={() => handleOpenEdit(prod)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="admin-action-icon-btn"
                          title="Duplicar"
                          onClick={() => handleDuplicate(prod.id)}
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          type="button"
                          className="admin-action-icon-btn delete"
                          title="Excluir"
                          onClick={() => handleDelete(prod.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ==========================================================
          MODAL DE CADASTRO E EDIÇÃO DO PRODUTO
          ========================================================== */}
      {isModalOpen && editingProduct && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <div>
                <h2 className="admin-modal-title">
                  {editingProduct.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                </h2>
                <span className="admin-modal-subtitle">
                  Preencha os dados. O catálogo da Constru-J preserva variantes e unidades no WhatsApp.
                </span>
              </div>
              <button
                type="button"
                className="admin-btn-close-modal"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Abas do Formulário */}
            <div className="admin-modal-tabs">
              <button
                type="button"
                className={`admin-modal-tab-btn ${modalTab === 'info' ? 'active' : ''}`}
                onClick={() => setModalTab('info')}
              >
                1. Informações Principais
              </button>
              <button
                type="button"
                className={`admin-modal-tab-btn ${modalTab === 'photos' ? 'active' : ''}`}
                onClick={() => setModalTab('photos')}
              >
                2. Fotos ({photosList.length + 1})
              </button>
              <button
                type="button"
                className={`admin-modal-tab-btn ${modalTab === 'variants' ? 'active' : ''}`}
                onClick={() => setModalTab('variants')}
              >
                3. Variações ({variantsList.length})
              </button>
              <button
                type="button"
                className={`admin-modal-tab-btn ${modalTab === 'specs' ? 'active' : ''}`}
                onClick={() => setModalTab('specs')}
              >
                4. Especificações ({specsList.length})
              </button>
            </div>

            {formError && (
              <div className="admin-modal-alert">
                <span>{formError}</span>
              </div>
            )}

            <div className="admin-modal-body">
              {/* ABA 1: INFORMAÇÕES BÁSICAS */}
              {modalTab === 'info' && (
                <div className="admin-form-grid">
                  <div className="admin-form-col-span-2">
                    <label className="admin-label required">Nome do Produto</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Ex: Cimento CP II-Z-32 50kg"
                      value={editingProduct.nome || ''}
                      onChange={(e) =>
                        setEditingProduct((prev) => (prev ? { ...prev, nome: e.target.value } : null))
                      }
                    />
                  </div>

                  <div>
                    <label className="admin-label required">Código de Referência</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Ex: CJ-CIM-01"
                      value={editingProduct.codigo || ''}
                      onChange={(e) =>
                        setEditingProduct((prev) => (prev ? { ...prev, codigo: e.target.value } : null))
                      }
                    />
                  </div>

                  <div>
                    <label className="admin-label required">Categoria</label>
                    <select
                      className="admin-form-input"
                      value={editingProduct.categoria || ''}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev ? { ...prev, categoria: e.target.value as any } : null
                        )
                      }
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="admin-label">Marca / Fabricante</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Ex: Tigre, Votoran, Suvinil"
                      value={editingProduct.marca || ''}
                      onChange={(e) =>
                        setEditingProduct((prev) => (prev ? { ...prev, marca: e.target.value } : null))
                      }
                    />
                  </div>

                  <div>
                    <label className="admin-label">Unidade de Medida</label>
                    <select
                      className="admin-form-input"
                      value={editingProduct.unidade || 'un'}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev ? { ...prev, unidade: e.target.value } : null
                        )
                      }
                    >
                      <option value="un">un (Unidade / Peça)</option>
                      <option value="sc">sc (Saco)</option>
                      <option value="cx">cx (Caixa)</option>
                      <option value="m²">m² (Metro quadrado)</option>
                      <option value="m">m (Metro linear)</option>
                      <option value="kg">kg (Quilograma)</option>
                      <option value="lata">lata (Lata / Galão)</option>
                    </select>
                  </div>

                  <div>
                    <label className="admin-label">Quantidade Mínima</label>
                    <input
                      type="number"
                      min="1"
                      className="admin-form-input"
                      value={editingProduct.quantidadeMinima ?? 1}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev ? { ...prev, quantidadeMinima: Number(e.target.value) } : null
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="admin-label">Incremento por Clique</label>
                    <input
                      type="number"
                      min="1"
                      className="admin-form-input"
                      value={editingProduct.incremento ?? 1}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev ? { ...prev, incremento: Number(e.target.value) } : null
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-col-span-2">
                    <label className="admin-label">Descrição Comercial</label>
                    <textarea
                      rows={3}
                      className="admin-form-textarea"
                      placeholder="Descreva as qualidades, indicações de uso e características..."
                      value={editingProduct.descricao || ''}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev ? { ...prev, descricao: e.target.value } : null
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-col-span-2 admin-checkbox-group">
                    <label className="admin-checkbox-card">
                      <input
                        type="checkbox"
                        checked={editingProduct.isFeatured ?? false}
                        onChange={(e) =>
                          setEditingProduct((prev) =>
                            prev ? { ...prev, isFeatured: e.target.checked } : null
                          )
                        }
                      />
                      <div>
                        <strong>Destacar na Página Inicial</strong>
                        <span>Exibe este produto na seção de novidades da home</span>
                      </div>
                    </label>

                    <label className="admin-checkbox-card">
                      <input
                        type="checkbox"
                        checked={editingProduct.demonstrativo ?? true}
                        onChange={(e) =>
                          setEditingProduct((prev) =>
                            prev ? { ...prev, demonstrativo: e.target.checked } : null
                          )
                        }
                      />
                      <div>
                        <strong>Aviso de Demonstração</strong>
                        <span>Mantém a nota de confirmação comercial pelo WhatsApp</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* ABA 2: FOTOS */}
              {modalTab === 'photos' && (
                <div className="admin-photos-tab">
                  {/* Foto Principal */}
                  <div className="admin-main-photo-box">
                    <span className="admin-section-subtitle">Foto Principal do Catálogo</span>
                    <div className="admin-photo-preview-row">
                      <img
                        src={editingProduct.imagem || '/assets/produtos/placeholder.webp'}
                        alt="Foto principal"
                        className="admin-main-preview-img"
                      />
                      <div className="admin-photo-upload-actions">
                        <label className="admin-btn-upload-file">
                          <Upload size={16} />
                          <span>Substituir Imagem Principal</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainPhotoUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {uploadProgress !== null && (
                          <span className="admin-upload-progress">
                            Carregando: {uploadProgress}%
                          </span>
                        )}
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="Ou informe a URL da imagem..."
                          value={editingProduct.imagem || ''}
                          onChange={(e) =>
                            setEditingProduct((prev) =>
                              prev ? { ...prev, imagem: e.target.value } : null
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fotos Adicionais */}
                  <div className="admin-additional-photos-box">
                    <div className="admin-additional-header">
                      <span className="admin-section-subtitle">
                        Fotos Adicionais da Galeria ({photosList.length})
                      </span>
                      <label className="admin-btn-secondary-sm">
                        <Plus size={14} />
                        <span>Adicionar Fotos</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleAdditionalPhotoUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {photosList.length === 0 ? (
                      <p className="admin-empty-hint">Nenhuma foto adicional cadastrada.</p>
                    ) : (
                      <div className="admin-photos-grid">
                        {photosList.map((p, idx) => (
                          <div key={p.id} className="admin-photo-card-item">
                            <img src={p.url} alt={p.alt} className="admin-photo-card-thumb" />
                            <div className="admin-photo-card-actions">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const list = [...photosList];
                                  const [moved] = list.splice(idx, 1);
                                  list.splice(idx - 1, 0, moved);
                                  setPhotosList(list);
                                }}
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === photosList.length - 1}
                                onClick={() => {
                                  const list = [...photosList];
                                  const [moved] = list.splice(idx, 1);
                                  list.splice(idx + 1, 0, moved);
                                  setPhotosList(list);
                                }}
                              >
                                <ChevronDown size={14} />
                              </button>
                              <button
                                type="button"
                                className="text-red"
                                onClick={() => setPhotosList((prev) => prev.filter((_, i) => i !== idx))}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ABA 3: VARIANTES */}
              {modalTab === 'variants' && (
                <div className="admin-variants-tab">
                  <p className="admin-tab-info-text">
                    Cadastre opções como tamanhos, cores ou modelos. As variantes escolhidas pelo cliente
                    são enviadas detalhadamente na mensagem de orçamento no WhatsApp.
                  </p>

                  <div className="admin-variant-add-row">
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Nome da variante (ex: 20x20cm, Branco, 3.6L)"
                      value={newVariantName}
                      onChange={(e) => setNewVariantName(e.target.value)}
                    />
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Detalhe adicional (ex: Acabamento acetinado)"
                      value={newVariantDetail}
                      onChange={(e) => setNewVariantDetail(e.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => {
                        if (!newVariantName.trim()) return;
                        setVariantsList((prev) => [
                          ...prev,
                          {
                            id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                            nome: newVariantName.trim(),
                            detalhe: newVariantDetail.trim() || undefined
                          }
                        ]);
                        setNewVariantName('');
                        setNewVariantDetail('');
                      }}
                    >
                      <Plus size={16} />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  {variantsList.length === 0 ? (
                    <p className="admin-empty-hint">Este produto não possui variantes cadastradas (versão única).</p>
                  ) : (
                    <div className="admin-variant-items-list">
                      {variantsList.map((v, i) => (
                        <div key={v.id} className="admin-variant-item-badge">
                          <span className="admin-v-name">{v.nome}</span>
                          {v.detalhe && <span className="admin-v-detail">({v.detalhe})</span>}
                          <button
                            type="button"
                            className="admin-v-remove-btn"
                            onClick={() => setVariantsList((prev) => prev.filter((_, idx) => idx !== i))}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ABA 4: ESPECIFICAÇÕES */}
              {modalTab === 'specs' && (
                <div className="admin-specs-tab">
                  <div className="admin-spec-add-row">
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Característica (ex: Rendimento, Composição)"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                    />
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Valor (ex: Até 18m² por demão)"
                      value={newSpecVal}
                      onChange={(e) => setNewSpecVal(e.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => {
                        if (!newSpecKey.trim() || !newSpecVal.trim()) return;
                        setSpecsList((prev) => [
                          ...prev,
                          { chave: newSpecKey.trim(), valor: newSpecVal.trim() }
                        ]);
                        setNewSpecKey('');
                        setNewSpecVal('');
                      }}
                    >
                      <Plus size={16} />
                      <span>Inserir</span>
                    </button>
                  </div>

                  {specsList.length === 0 ? (
                    <p className="admin-empty-hint">Nenhuma especificação técnica cadastrada.</p>
                  ) : (
                    <div className="admin-specs-table">
                      {specsList.map((s, i) => (
                        <div key={i} className="admin-spec-row">
                          <strong>{s.chave}:</strong>
                          <span>{s.valor}</span>
                          <button
                            type="button"
                            className="admin-spec-remove-btn"
                            onClick={() => setSpecsList((prev) => prev.filter((_, idx) => idx !== i))}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rodapé do Modal com Ações Claras de Publicação vs Rascunho */}
            <div className="admin-modal-footer">
              <div className="admin-footer-left">
                <span className="admin-status-label">Situação ao salvar:</span>
                <select
                  className="admin-status-select"
                  value={editingProduct.status || 'draft'}
                  onChange={(e) =>
                    setEditingProduct((prev) =>
                      prev ? { ...prev, status: e.target.value as ProductStatus } : null
                    )
                  }
                >
                  <option value="published">Publicado (Visível no site)</option>
                  <option value="draft">Rascunho (Em edição)</option>
                  <option value="hidden">Oculto (Inativo temporariamente)</option>
                </select>
              </div>

              <div className="admin-footer-right">
                <button
                  type="button"
                  className="admin-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="admin-btn-save-draft"
                  disabled={saving}
                  onClick={() => handleSave('draft')}
                >
                  Salvar Rascunho
                </button>

                <button
                  type="button"
                  className="admin-btn-publish"
                  disabled={saving}
                  onClick={() => handleSave('published')}
                >
                  <Check size={16} />
                  <span>{saving ? 'Publicando...' : 'Salvar & Publicar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
