import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { login } from '../services/auth';
import { AdminUser } from '../types/admin';
import './AdminLogin.css';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = (sampleEmail: string) => {
    setEmail(sampleEmail);
    setPassword('admin123');
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img
            src="/logo-constru-j.svg"
            alt="Constru-J"
            className="admin-login-logo"
            width="220"
            height="52"
          />
          <span className="admin-login-badge">Gestão Interna</span>
          <h1 className="admin-login-title">Acesso ao Painel</h1>
          <p className="admin-login-desc">
            Entre com suas credenciais para gerenciar produtos, dados e conteúdo da loja.
          </p>
        </div>

        {error && (
          <div className="admin-login-alert" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="login-email">E-mail corporativo</label>
            <div className="admin-input-wrapper">
              <Mail size={18} className="admin-input-icon" />
              <input
                id="login-email"
                type="email"
                required
                placeholder="exemplo@construj.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="login-password">Senha</label>
            <div className="admin-input-wrapper">
              <Lock size={18} className="admin-input-icon" />
              <input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn-submit-login"
            disabled={loading}
          >
            <span>{loading ? 'Entrando...' : 'Acessar Painel'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Atalhos para preenchimento rápido de teste */}
        <div className="admin-login-shortcuts">
          <span className="admin-shortcuts-label">Acesso rápido para testes locais:</span>
          <div className="admin-shortcuts-btns">
            <button
              type="button"
              className="admin-shortcut-chip"
              onClick={() => handleFillSample('admin@construj.com.br')}
            >
              <ShieldCheck size={14} />
              <span>Entrar como Administrador</span>
            </button>
            <button
              type="button"
              className="admin-shortcut-chip"
              onClick={() => handleFillSample('editor@construj.com.br')}
            >
              <span>Entrar como Editor</span>
            </button>
          </div>
        </div>

        <div className="admin-login-footer">
          <a href="/" className="admin-back-public-link">
            ← Voltar para o site público da Constru-J
          </a>
        </div>
      </div>
    </div>
  );
};
