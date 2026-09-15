import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  MoveUp,
  MoveDown,
  X,
  AlertTriangle,
  Layers,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  getCategories,
  saveCategory,
  countProductsInCategory,
  deleteCategoryWithTransfer
} from '../../services/db';
import { CategoryAdmin } from '../../types/admin';
import { getCurrentUser } from '../../services/auth';
import { thiingsAssets } from '../../data/thiingsAssets';

export const CategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<CategoryAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de Edição / Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryAdmin> | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal de Exclusão Segura com Transferência
  const [deletingCategory, setDeletingCategory] = useState<CategoryAdmin | null>(null);
  const [affectedCount, setAffectedCount] = useState<number>(0);
  const [transferTargetId, setTransferTargetId] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

  const currentUser = getCurrentUser() || { nome: 'Administrador', email: 'admin@construj.com.br' };

  const loadData = async () => {
    try {
      const cats = await getCategories(true);
      setCategories(cats);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory({
      nome: '',
      descricao: '',
      imagem: '/assets/categorias/pisos.webp',
      icone: 'Building2',
      ativo: true,
      showOnHome: true,
      ordem: categories.length + 1
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryAdmin) => {
    setEditingCategory({ ...cat });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.nome?.trim()) {
      setFormError('Informe o nome da categoria.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      await saveCategory(editingCategory as any, currentUser);
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar categoria.');
    } finally {
      setSaving(false);
    }
  };

  // Iniciar exclusão com contagem de produtos afetados
  const handlePromptDelete = async (cat: CategoryAdmin) => {
    const count = await countProductsInCategory(cat.id);
    setDeletingCategory(cat);
    setAffectedCount(count);
    // Sugere primeira categoria diferente para transferência
    const otherCats = categories.filter((c) => c.id !== cat.id);
    setTransferTargetId(otherCats[0]?.id || '');
  };

  // Concluir exclusão transferindo produtos
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    if (affectedCount > 0 && !transferTargetId) {
      alert('Selecione uma categoria de destino para transferir os produtos.');
      return;
    }

    setDeleting(true);
    try {
      await deleteCategoryWithTransfer(
        deletingCategory.id,
        transferTargetId || categories.find((c) => c.id !== deletingCategory.id)?.id || 'basicos',
        currentUser
      );
      setDeletingCategory(null);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Reordenação
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const list = [...categories];
    const current = list[index];
    const target = list[targetIndex];

    const tempOrder = current.ordem;
    current.ordem = target.ordem;
    target.ordem = tempOrder;

    await saveCategory(current, currentUser);
    await saveCategory(target, currentUser);
    await loadData();
  };

  return (
    <div className="admin-view-container">
      {/* Cabeçalho */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-page-title">Categorias de Materiais</h1>
          <p className="admin-page-desc">
            Organize os setores do catálogo, ilustrações representativas e visibilidade na home.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleOpenCreate}
        >
          <Plus size={18} />
          <span>Nova categoria</span>
        </button>
      </div>

      {/* Tabela de Categorias */}
      <div className="admin-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Ordem</th>
              <th>Nome & Ilustração</th>
              <th>Descrição</th>
              <th>Exibir na Home</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={cat.id}>
                <td>
                  <div className="admin-order-controls">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      title="Subir ordem"
                    >
                      <MoveUp size={14} />
                    </button>
                    <span>{cat.ordem}</span>
                    <button
                      type="button"
                      disabled={idx === categories.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      title="Descer ordem"
                    >
                      <MoveDown size={14} />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="admin-cat-cell">
                    <div className="admin-cat-icon-thumb">
                      <Layers size={20} />
                    </div>
                    <div>
                      <span className="admin-cat-cell-name">{cat.nome}</span>
                      <span className="admin-cat-cell-id">ID: {cat.id}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="admin-cat-desc-cell">{cat.descricao || '—'}</span>
                </td>
                <td>
                  <button
                    type="button"
                    className={`admin-toggle-chip ${cat.showOnHome ? 'active' : ''}`}
                    onClick={async () => {
                      await saveCategory({ ...cat, showOnHome: !cat.showOnHome }, currentUser);
                      await loadData();
                    }}
                  >
                    {cat.showOnHome ? 'Sim (Home)' : 'Oculto na Home'}
                  </button>
                </td>
                <td>
                  <span className={`admin-status-badge ${cat.ativo ? 'published' : 'hidden'}`}>
                    {cat.ativo ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-action-icon-btn"
                      title="Editar"
                      onClick={() => handleOpenEdit(cat)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-action-icon-btn delete"
                      title="Excluir"
                      disabled={categories.length <= 1}
                      onClick={() => handlePromptDelete(cat)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Criação / Edição de Categoria */}
      {isModalOpen && editingCategory && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box" style={{ maxWidth: 580 }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingCategory.id ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button
                type="button"
                className="admin-btn-close-modal"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="admin-modal-alert">
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-col-span-2">
                    <label className="admin-label required">Nome da Categoria</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Ex: Pisos e porcelanatos"
                      value={editingCategory.nome || ''}
                      onChange={(e) =>
                        setEditingCategory((prev) => (prev ? { ...prev, nome: e.target.value } : null))
                      }
                    />
                  </div>

                  <div className="admin-form-col-span-2">
                    <label className="admin-label">Descrição</label>
                    <textarea
                      rows={2}
                      className="admin-form-textarea"
                      placeholder="Breve descrição dos materiais incluídos neste nicho..."
                      value={editingCategory.descricao || ''}
                      onChange={(e) =>
                        setEditingCategory((prev) =>
                          prev ? { ...prev, descricao: e.target.value } : null
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="admin-label">Ordem de Exibição</label>
                    <input
                      type="number"
                      min="1"
                      className="admin-form-input"
                      value={editingCategory.ordem || 1}
                      onChange={(e) =>
                        setEditingCategory((prev) =>
                          prev ? { ...prev, ordem: Number(e.target.value) } : null
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="admin-label">Ilustração 3D Oficial</label>
                    <select
                      className="admin-form-input"
                      value={editingCategory.thiingId || ''}
                      onChange={(e) =>
                        setEditingCategory((prev) =>
                          prev ? { ...prev, thiingId: e.target.value } : null
                        )
                      }
                    >
                      <option value="">Nenhuma / Padrão</option>
                      {Object.keys(thiingsAssets).map((key) => (
                        <option key={key} value={key}>
                          {thiingsAssets[key].name} ({key})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-col-span-2 admin-checkbox-group">
                    <label className="admin-checkbox-card">
                      <input
                        type="checkbox"
                        checked={editingCategory.showOnHome ?? true}
                        onChange={(e) =>
                          setEditingCategory((prev) =>
                            prev ? { ...prev, showOnHome: e.target.checked } : null
                          )
                        }
                      />
                      <div>
                        <strong>Aparecer na Página Inicial</strong>
                        <span>Exibe o card desta categoria na seção de destaques da home</span>
                      </div>
                    </label>

                    <label className="admin-checkbox-card">
                      <input
                        type="checkbox"
                        checked={editingCategory.ativo ?? true}
                        onChange={(e) =>
                          setEditingCategory((prev) =>
                            prev ? { ...prev, ativo: e.target.checked } : null
                          )
                        }
                      />
                      <div>
                        <strong>Categoria Ativa</strong>
                        <span>Habilita a visualização desta categoria no catálogo público</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="admin-btn-publish"
                  disabled={saving}
                >
                  <Check size={16} />
                  <span>{saving ? 'Salvando...' : 'Salvar Categoria'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exclusão Segura com Transferência de Produtos */}
      {deletingCategory && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box" style={{ maxWidth: 520 }}>
            <div className="admin-modal-header danger">
              <div className="admin-danger-title-row">
                <AlertTriangle size={24} className="text-red" />
                <h2 className="admin-modal-title">Excluir Categoria: {deletingCategory.nome}</h2>
              </div>
              <button
                type="button"
                className="admin-btn-close-modal"
                onClick={() => setDeletingCategory(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-delete-warning-box">
                <p>
                  Esta categoria possui <strong>{affectedCount} produto(s)</strong> vinculados a ela.
                </p>
                <p className="admin-delete-notice">
                  Regra do sistema Constru-J: <strong>Os produtos não são excluídos</strong>.
                  Eles devem ser transferidos para outra categoria existente para manter o catálogo seguro.
                </p>
              </div>

              {affectedCount > 0 && (
                <div className="admin-form-group" style={{ marginTop: 18 }}>
                  <label className="admin-label required">
                    Selecione a categoria de destino para os {affectedCount} produto(s):
                  </label>
                  <select
                    className="admin-form-input"
                    value={transferTargetId}
                    onChange={(e) => setTransferTargetId(e.target.value)}
                  >
                    {categories
                      .filter((c) => c.id !== deletingCategory.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          Transferir para: {c.nome}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-cancel"
                onClick={() => setDeletingCategory(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="admin-btn-danger"
                disabled={deleting}
                onClick={handleConfirmDelete}
              >
                <Trash2 size={16} />
                <span>{deleting ? 'Transferindo & Excluindo...' : 'Confirmar e Transferir'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
