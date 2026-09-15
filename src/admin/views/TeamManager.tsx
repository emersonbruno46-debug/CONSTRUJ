import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  Trash2,
  Check,
  X,
  History,
  AlertCircle
} from 'lucide-react';
import {
  getAdminUsers,
  saveAdminUser,
  deleteAdminUser,
  getAuditLogs
} from '../../services/db';
import { AdminUser, AuditLogEntry, UserRole } from '../../types/admin';
import { getCurrentUser } from '../../services/auth';

export const TeamManager: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Novo Usuário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('editor');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentUser: AdminUser = getCurrentUser() || {
    id: 'user-admin-1',
    nome: 'Administrador',
    email: 'admin@construj.com.br',
    papel: 'admin',
    ativo: true,
    criadoEm: new Date().toISOString()
  };
  const isAdmin = currentUser.papel === 'admin';

  const loadData = async () => {
    try {
      const [uList, logs] = await Promise.all([getAdminUsers(), getAuditLogs(20)]);
      setUsers(uList);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Erro ao carregar equipe:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Apenas administradores podem cadastrar novos membros.');
      return;
    }
    if (!newName.trim() || !newEmail.trim()) {
      setErrorMsg('Informe nome e e-mail válidos.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      await saveAdminUser(
        {
          nome: newName,
          email: newEmail,
          papel: newRole,
          ativo: true
        },
        currentUser
      );
      setIsModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewRole('editor');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao criar usuário.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!isAdmin) {
      alert('Apenas administradores podem gerenciar usuários.');
      return;
    }
    if (confirm('Tem certeza de que deseja remover este membro da equipe?')) {
      try {
        await deleteAdminUser(id, currentUser);
        await loadData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleToggleActive = async (u: AdminUser) => {
    if (!isAdmin) return;
    try {
      await saveAdminUser({ ...u, ativo: !u.ativo }, currentUser);
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
          <h1 className="admin-page-title">Equipe & Permissões</h1>
          <p className="admin-page-desc">
            Controle de acesso restrito. Administradores gerenciam tudo; Editores atualizam produtos e aparência.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => {
              setErrorMsg(null);
              setIsModalOpen(true);
            }}
          >
            <UserPlus size={18} />
            <span>Adicionar membro</span>
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="admin-alert-info">
          <ShieldAlert size={18} />
          <span>
            Seu perfil atual é <strong>Editor</strong>. Você pode consultar os membros da equipe, mas apenas
            um <strong>Administrador</strong> pode convidar ou alterar permissões.
          </span>
        </div>
      )}

      {/* Tabela de Membros */}
      <div className="admin-card-section">
        <div className="admin-sec-title-group">
          <Users size={20} className="admin-sec-icon" />
          <h2 className="admin-section-title">Membros Autorizados ({users.length})</h2>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Membro</th>
                <th>E-mail</th>
                <th>Papel de Acesso</th>
                <th>Status</th>
                <th>Data de Cadastro</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-user-avatar-sm">{u.nome.charAt(0).toUpperCase()}</span>
                      <span className="admin-user-cell-name">{u.nome}</span>
                    </div>
                  </td>
                  <td>
                    <span className="admin-email-text">{u.email}</span>
                  </td>
                  <td>
                    <span className={`admin-role-badge ${u.papel}`}>
                      {u.papel === 'admin' ? 'Administrador' : 'Editor de Conteúdo'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-status-badge ${u.ativo ? 'published' : 'hidden'}`}>
                      {u.ativo ? 'Ativo' : 'Desativado'}
                    </span>
                  </td>
                  <td>
                    <span className="admin-date-text">
                      {new Date(u.criadoEm).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-btn-table-action"
                          onClick={() => handleToggleActive(u)}
                          title={u.ativo ? 'Desativar acesso' : 'Ativar acesso'}
                        >
                          {u.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          type="button"
                          className="admin-action-icon-btn delete"
                          title="Remover da equipe"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico Completo de Auditoria */}
      <div className="admin-card-section">
        <div className="admin-sec-title-group">
          <History size={20} className="admin-sec-icon" />
          <h2 className="admin-section-title">Registro Geral de Auditoria (Logs)</h2>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Data & Hora</th>
                <th>Autor</th>
                <th>Ação</th>
                <th>Alvo</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className="admin-date-text">
                      {new Date(log.dataHora).toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td>
                    <span className="admin-log-author">{log.autorNome}</span>
                  </td>
                  <td>
                    <span className="admin-action-badge">{log.acao}</span>
                  </td>
                  <td>
                    <span className="admin-entity-badge">{log.entidadeNome || log.entidade}</span>
                  </td>
                  <td>
                    <span className="admin-details-text">{log.detalhes || '—'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Convidar / Adicionar Membro */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box" style={{ maxWidth: 480 }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Adicionar Membro da Equipe</h2>
              <button
                type="button"
                className="admin-btn-close-modal"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div className="admin-modal-alert">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label required">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="Ex: Carlos Silva"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <div className="admin-form-group" style={{ marginTop: 14 }}>
                  <label className="admin-label required">E-mail Corporativo</label>
                  <input
                    type="email"
                    required
                    className="admin-form-input"
                    placeholder="carlos@construj.com.br"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                <div className="admin-form-group" style={{ marginTop: 14 }}>
                  <label className="admin-label required">Nível de Permissão</label>
                  <select
                    className="admin-form-input"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                  >
                    <option value="editor">Editor (Catálogo e Aparência)</option>
                    <option value="admin">Administrador (Controle Total)</option>
                  </select>
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
                  <span>{saving ? 'Gravando...' : 'Adicionar Membro'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
