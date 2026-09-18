import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Palette,
  Store,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { DashboardView } from './views/DashboardView';
import { ProductsManager } from './views/ProductsManager';
import { CategoriesManager } from './views/CategoriesManager';
import { AppearanceManager } from './views/AppearanceManager';
import { StoreSettingsManager } from './views/StoreSettingsManager';
import { TeamManager } from './views/TeamManager';
import { getCurrentUser, logout } from '../services/auth';
import { AdminUser } from '../types/admin';
import './AdminLayout.css';
import './AdminViews.css';

export const AdminRoot: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    document.body.classList.add('admin-mode');
    const user = getCurrentUser();
    setCurrentUser(user);
    setCheckingAuth(false);

    // Sincroniza com hash ou path se houver
    let path = window.location.pathname.replace('/admin', '').replace('/', '');
    if (!path && window.location.hash.includes('admin/')) {
      path = window.location.hash.split('admin/')[1]?.split('?')[0]?.replace('/', '');
    }
    if (path && ['inicio', 'produtos', 'categorias', 'aparencia', 'loja', 'equipe'].includes(path)) {
      setActiveTab(path);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    const suffix = tab === 'inicio' ? '' : `/${tab}`;
    if (window.location.hash.includes('admin')) {
      window.location.hash = `#/admin${suffix}`;
    } else {
      window.history.pushState({}, '', `/admin${suffix}`);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="admin-app-root" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p>Carregando painel...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="admin-app-root">
      {/* Top Navbar */}
      <header className="admin-top-navbar">
        <div className="admin-nav-left">
          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Abrir menu de navegação"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <a href="/admin" className="admin-brand-link">
            <img
              src="/logo-constru-j.svg"
              alt="Constru-J"
              style={{ height: '36px', width: 'auto' }}
            />
            <span className="admin-brand-badge">Gestão</span>
          </a>
        </div>

        <div className="admin-nav-right">
          <a href="/" className="admin-btn-view-site">
            <ExternalLink size={15} />
            <span>Ver site público</span>
          </a>

          <div className="admin-user-pill">
            <span className="admin-user-avatar">
              {currentUser.nome.charAt(0).toUpperCase()}
            </span>
            <div className="admin-user-info">
              <span className="admin-user-name">{currentUser.nome}</span>
              <span className="admin-user-role">
                {currentUser.papel === 'admin' ? 'Administrador' : 'Editor'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="admin-btn-logout"
            onClick={handleLogout}
            title="Sair do painel"
            aria-label="Encerrar sessão"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="admin-main-wrapper">
        {/* Backdrop mobile */}
        {isSidebarOpen && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <nav className="admin-sidebar-nav" aria-label="Navegação administrativa">
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'inicio' ? 'active' : ''}`}
              onClick={() => handleTabChange('inicio')}
            >
              <LayoutDashboard size={18} />
              <span>Início</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'produtos' ? 'active' : ''}`}
              onClick={() => handleTabChange('produtos')}
            >
              <Package size={18} />
              <span>Produtos</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'categorias' ? 'active' : ''}`}
              onClick={() => handleTabChange('categorias')}
            >
              <Layers size={18} />
              <span>Categorias</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'aparencia' ? 'active' : ''}`}
              onClick={() => handleTabChange('aparencia')}
            >
              <Palette size={18} />
              <span>Aparência do site</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'loja' ? 'active' : ''}`}
              onClick={() => handleTabChange('loja')}
            >
              <Store size={18} />
              <span>Dados da loja</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'equipe' ? 'active' : ''}`}
              onClick={() => handleTabChange('equipe')}
            >
              <Users size={18} />
              <span>Equipe & Segurança</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="admin-content-area">
          {activeTab === 'inicio' && (
            <DashboardView
              onNavigate={handleTabChange}
              onNewProduct={() => handleTabChange('produtos')}
            />
          )}

          {activeTab === 'produtos' && <ProductsManager />}

          {activeTab === 'categorias' && <CategoriesManager />}

          {activeTab === 'aparencia' && <AppearanceManager />}

          {activeTab === 'loja' && <StoreSettingsManager />}

          {activeTab === 'equipe' && <TeamManager />}
        </main>
      </div>
    </div>
  );
};
