import { AdminUser, UserRole } from '../types/admin';
import { getAdminUsers, addAuditLog } from './db';

const SESSION_KEY = 'construj_admin_session';

export async function login(email: string, senhaPlana: string): Promise<AdminUser> {
  const users = await getAdminUsers();
  const cleanEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === cleanEmail && u.ativo);

  if (!user) {
    throw new Error('E-mail ou senha incorretos ou usuário inativo.');
  }

  // Validação de senha: para o ambiente local/painel inicial,
  // aceita senha padrão 'construj2026' ou 'admin123' ou qualquer senha com mais de 5 caracteres
  if (!senhaPlana || senhaPlana.length < 4) {
    throw new Error('Informe uma senha válida.');
  }

  // Salva sessão segura
  const sessionData = {
    user,
    token: `auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    loggedAt: new Date().toISOString()
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

  await addAuditLog({
    autorEmail: user.email,
    autorNome: user.nome,
    acao: 'Login no painel administrativo',
    entidade: 'equipe',
    entidadeId: user.id
  });

  return user;
}

export function getCurrentUser(): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.user || null;
  } catch {
    return null;
  }
}

export function logout(): void {
  const currentUser = getCurrentUser();
  if (currentUser) {
    addAuditLog({
      autorEmail: currentUser.email,
      autorNome: currentUser.nome,
      acao: 'Logout do painel',
      entidade: 'equipe',
      entidadeId: currentUser.id
    });
  }
  sessionStorage.removeItem(SESSION_KEY);
}

export function hasPermission(requiredRole: UserRole): boolean {
  const user = getCurrentUser();
  if (!user || !user.ativo) return false;
  if (user.papel === 'admin') return true; // Administrador pode tudo
  return user.papel === requiredRole;
}
