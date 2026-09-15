import React, { useEffect, useState } from 'react';
import {
  PackageCheck,
  FileEdit,
  AlertTriangle,
  PlusCircle,
  Star,
  Clock,
  ExternalLink,
  History,
  ArrowRight
} from 'lucide-react';
import { getProducts, getAuditLogs } from '../../services/db';
import { ProductAdmin, AuditLogEntry } from '../../types/admin';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onNewProduct: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onNewProduct }) => {
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prods = await getProducts(true);
        const auditLogs = await getAuditLogs(8);
        setProducts(prods);
        setLogs(auditLogs);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const publishedCount = products.filter((p) => p.status === 'published' && p.ativo).length;
  const draftOrHiddenCount = products.filter(
    (p) => p.status === 'draft' || p.status === 'hidden' || !p.ativo
  ).length;

  // Cadastros com informações obrigatórias pendentes (ex: sem imagem ou sem descrição ou sem categoria)
  const pendingCount = products.filter(
    (p) =>
      !p.imagem ||
      p.imagem.includes('placeholder') ||
      !p.descricao ||
      p.descricao.trim() === '' ||
      !p.codigo
  ).length;

  return (
    <div className="admin-view-container">
      {/* Cabeçalho da Vista */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-page-title">Visão Geral</h1>
          <p className="admin-page-desc">
            Acompanhe a situação do catálogo online e os registros mais recentes da Constru-J.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={onNewProduct}
        >
          <PlusCircle size={18} />
          <span>Cadastrar produto</span>
        </button>
      </div>

      {/* Cards de Métricas Reais */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card published">
          <div className="admin-stat-icon-wrapper green">
            <PackageCheck size={26} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-number">{publishedCount}</span>
            <span className="admin-stat-label">Produtos Publicados no Catálogo</span>
          </div>
        </div>

        <div className="admin-stat-card drafts">
          <div className="admin-stat-icon-wrapper orange">
            <FileEdit size={26} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-number">{draftOrHiddenCount}</span>
            <span className="admin-stat-label">Rascunhos e Produtos Ocultos</span>
          </div>
        </div>

        <div className="admin-stat-card pending">
          <div className="admin-stat-icon-wrapper yellow">
            <AlertTriangle size={26} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-number">{pendingCount}</span>
            <span className="admin-stat-label">Com Informações Pendentes</span>
          </div>
        </div>
      </div>

      {/* Atalhos Rápidos Operacionais */}
      <div className="admin-card-section">
        <h2 className="admin-section-title">Atalhos Operacionais</h2>
        <div className="admin-shortcuts-grid">
          <button
            type="button"
            className="admin-shortcut-card"
            onClick={onNewProduct}
          >
            <div className="admin-sc-icon green">
              <PlusCircle size={22} />
            </div>
            <div className="admin-sc-texts">
              <span className="admin-sc-title">Cadastrar produto</span>
              <span className="admin-sc-desc">Adicione novo item, fotos e variantes ao catálogo</span>
            </div>
            <ArrowRight size={18} className="admin-sc-arrow" />
          </button>

          <button
            type="button"
            className="admin-shortcut-card"
            onClick={() => onNavigate('aparencia')}
          >
            <div className="admin-sc-icon orange">
              <Star size={22} />
            </div>
            <div className="admin-sc-texts">
              <span className="admin-sc-title">Editar destaques</span>
              <span className="admin-sc-desc">Selecione os produtos que aparecem na vitrine da home</span>
            </div>
            <ArrowRight size={18} className="admin-sc-arrow" />
          </button>

          <button
            type="button"
            className="admin-shortcut-card"
            onClick={() => onNavigate('loja')}
          >
            <div className="admin-sc-icon blue">
              <Clock size={22} />
            </div>
            <div className="admin-sc-texts">
              <span className="admin-sc-title">Atualizar horários</span>
              <span className="admin-sc-desc">Configure horário de funcionamento e feriados</span>
            </div>
            <ArrowRight size={18} className="admin-sc-arrow" />
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-shortcut-card"
          >
            <div className="admin-sc-icon gray">
              <ExternalLink size={22} />
            </div>
            <div className="admin-sc-texts">
              <span className="admin-sc-title">Visualizar site</span>
              <span className="admin-sc-desc">Abra a visão pública do visitante em nova aba</span>
            </div>
            <ArrowRight size={18} className="admin-sc-arrow" />
          </a>
        </div>
      </div>

      {/* Histórico Recente de Alterações */}
      <div className="admin-card-section">
        <div className="admin-section-header-row">
          <div className="admin-sec-title-group">
            <History size={20} className="admin-sec-icon" />
            <h2 className="admin-section-title">Últimas Alterações Realizadas</h2>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="admin-empty-box">
            <p>Nenhuma alteração registrada recentemente.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Responsável</th>
                  <th>Ação</th>
                  <th>Entidade</th>
                  <th>Data e Horário</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="admin-user-cell">
                        <span className="admin-user-avatar-sm">
                          {log.autorNome.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <span className="admin-user-cell-name">{log.autorNome}</span>
                          <span className="admin-user-cell-email">{log.autorEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-action-badge">{log.acao}</span>
                    </td>
                    <td>
                      <span className="admin-entity-badge">{log.entidadeNome || log.entidade}</span>
                    </td>
                    <td>
                      <span className="admin-date-text">
                        {new Date(log.dataHora).toLocaleString('pt-BR')}
                      </span>
                    </td>
                    <td>
                      <span className="admin-details-text">{log.detalhes || '—'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
