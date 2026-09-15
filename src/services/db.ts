import { productsData } from '../data/products';
import { categoriesData } from '../data/categories';
import { companyData } from '../data/company';
import {
  AdminUser,
  ProductAdmin,
  CategoryAdmin,
  StoreSettingsAdmin,
  SiteAppearanceAdmin,
  AuditLogEntry
} from '../types/admin';

const DB_NAME = 'constru_j_db';
const DB_VERSION = 1;

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeToDataChanges(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyDataChanged() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Erro ao notificar listener:', e);
    }
  });
}

// Abre ou cria o banco IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('products')) {
        const prodStore = db.createObjectStore('products', { keyPath: 'id' });
        prodStore.createIndex('categoria', 'categoria', { unique: false });
        prodStore.createIndex('status', 'status', { unique: false });
        prodStore.createIndex('codigo', 'codigo', { unique: false });
      }

      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('store_settings')) {
        db.createObjectStore('store_settings', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('site_appearance')) {
        db.createObjectStore('site_appearance', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('admin_users')) {
        const userStore = db.createObjectStore('admin_users', { keyPath: 'id' });
        userStore.createIndex('email', 'email', { unique: true });
      }

      if (!db.objectStoreNames.contains('audit_logs')) {
        const logStore = db.createObjectStore('audit_logs', { keyPath: 'id' });
        logStore.createIndex('dataHora', 'dataHora', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Transação auxiliar com Promessa
function executeTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      let request: IDBRequest<T> | void;

      try {
        request = action(store);
      } catch (err) {
        reject(err);
        return;
      }

      tx.oncomplete = () => {
        if (request && 'result' in request) {
          resolve(request.result);
        } else {
          resolve(undefined as unknown as T);
        }
      };

      tx.onerror = () => reject(tx.error);
    });
  });
}

/**
 * Inicialização e migração idempotente:
 * Se o banco estiver vazio, carrega todos os dados públicos existentes
 * para garantir que nada seja perdido.
 */
let initPromise: Promise<void> | null = null;

export async function initializeDatabase(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = await openDB();

    // 1. Verifica e migra Usuários Iniciais
    const usersCount = await new Promise<number>((resolve) => {
      const tx = db.transaction('admin_users', 'readonly');
      const req = tx.objectStore('admin_users').count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(0);
    });

    if (usersCount === 0) {
      const defaultUsers: AdminUser[] = [
        {
          id: 'user-admin-1',
          nome: 'Administrador Constru-J',
          email: 'admin@construj.com.br',
          papel: 'admin',
          ativo: true,
          criadoEm: new Date().toISOString()
        },
        {
          id: 'user-editor-1',
          nome: 'Equipe de Catálogo',
          email: 'editor@construj.com.br',
          papel: 'editor',
          ativo: true,
          criadoEm: new Date().toISOString()
        }
      ];

      const tx = db.transaction('admin_users', 'readwrite');
      const store = tx.objectStore('admin_users');
      defaultUsers.forEach((u) => store.put(u));
    }

    // 2. Verifica e migra Categorias
    const catCount = await new Promise<number>((resolve) => {
      const tx = db.transaction('categories', 'readonly');
      const req = tx.objectStore('categories').count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(0);
    });

    if (catCount === 0) {
      const tx = db.transaction('categories', 'readwrite');
      const store = tx.objectStore('categories');
      categoriesData.forEach((cat, index) => {
        const catAdmin: CategoryAdmin = {
          ...cat,
          ativo: true,
          showOnHome: true,
          ordem: index + 1
        };
        store.put(catAdmin);
      });
    }

    // 3. Verifica e migra Produtos
    const prodCount = await new Promise<number>((resolve) => {
      const tx = db.transaction('products', 'readonly');
      const req = tx.objectStore('products').count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(0);
    });

    if (prodCount === 0) {
      const tx = db.transaction('products', 'readwrite');
      const store = tx.objectStore('products');
      productsData.forEach((p, idx) => {
        const prodAdmin: ProductAdmin = {
          ...p,
          status: 'published',
          isFeatured: idx < 6, // primeiros 6 destacados na home
          ativo: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updatedBy: 'Sistema'
        };
        store.put(prodAdmin);
      });
    } else {
      // Sincroniza fotos atualizadas dos produtos padrão/demonstrativos caso o usuário já tenha aberto a aplicação
      const tx = db.transaction('products', 'readwrite');
      const store = tx.objectStore('products');
      const req = store.getAll();
      req.onsuccess = () => {
        const list: ProductAdmin[] = req.result || [];
        list.forEach((existing) => {
          const fresh = productsData.find((p) => p.id === existing.id);
          if (fresh && fresh.imagem !== existing.imagem && (existing.imagem.includes('/assets/produtos/') || !existing.imagem.startsWith('data:'))) {
            existing.imagem = fresh.imagem;
            store.put(existing);
          }
        });
      };
    }

    // 4. Configurações da Loja
    const storeSettingsExist = await new Promise<boolean>((resolve) => {
      const tx = db.transaction('store_settings', 'readonly');
      const req = tx.objectStore('store_settings').get('config_default');
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    });

    if (!storeSettingsExist) {
      const defaultSettings: StoreSettingsAdmin & { id: string } = {
        id: 'config_default',
        ...companyData,
        quoteInitialMessage:
          'Olá, Constru-J! Montei este orçamento pelo catálogo online e gostaria de verificar disponibilidade e condições:',
        announcementBanner: {
          ativo: false,
          texto: 'Atendimento normal neste sábado até às 12:00. Faça seu orçamento online!'
        }
      };
      const tx = db.transaction('store_settings', 'readwrite');
      tx.objectStore('store_settings').put(defaultSettings);
    }

    // 5. Aparência do Site
    const appearanceExist = await new Promise<boolean>((resolve) => {
      const tx = db.transaction('site_appearance', 'readonly');
      const req = tx.objectStore('site_appearance').get('appearance_default');
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    });

    if (!appearanceExist) {
      const defaultAppearance: SiteAppearanceAdmin & { id: string } = {
        id: 'appearance_default',
        heroEyebrow: 'CONSTRU-J',
        heroHeadline: 'Tudo para construir e reformar, em um só lugar.',
        heroSubtitle: 'Materiais de construção e acabamentos em Rio Pardo de Minas.',
        heroBtnPrimaryText: 'Explorar produtos',
        heroBtnSecondaryText: 'Pedir orçamento',
        heroFacadeImage: '/assets/fotos/fachada-constru-j-limpa.jpg',
        featuredProductIds: productsData.slice(0, 6).map((p) => p.id),
        galleryPhotos: [
          {
            id: 'gal-1',
            url: '/assets/fotos/fachada-constru-j-limpa.jpg',
            titulo: 'Fachada Principal',
            legenda: 'Ampla estrutura e fácil acesso em Rio Pardo de Minas',
            alt: 'Fachada da loja Constru-J',
            ordem: 1
          },
          {
            id: 'gal-2',
            url: '/assets/fotos/ac269705d1c25943.jpg',
            titulo: 'Showroom de Pisos e Acabamentos',
            legenda: 'Variedade em pisos, revestimentos e louças',
            alt: 'Showroom Constru-J',
            ordem: 2
          },
          {
            id: 'gal-3',
            url: '/assets/fotos/3299db30aec36ebf.jpg',
            titulo: 'Setor de Tintas e Complementos',
            legenda: 'Cores, impermeabilizantes e acessórios para pintura',
            alt: 'Setor de Tintas',
            ordem: 3
          }
        ]
      };
      const tx = db.transaction('site_appearance', 'readwrite');
      tx.objectStore('site_appearance').put(defaultAppearance);
    }
  })();

  return initPromise;
}

// ==========================================================
// API DE PRODUTOS
// ==========================================================
export async function getProducts(includeDraftsAndHidden = false): Promise<ProductAdmin[]> {
  await initializeDatabase();
  const all = await executeTransaction<ProductAdmin[]>('products', 'readonly', (store) =>
    store.getAll()
  );

  return all.filter((p) => {
    // Soft delete nunca aparece
    if (p.deletedAt) return false;
    if (includeDraftsAndHidden) return true;
    return p.status === 'published' && p.ativo !== false;
  });
}

export async function getProductById(id: string): Promise<ProductAdmin | null> {
  await initializeDatabase();
  const prod = await executeTransaction<ProductAdmin | undefined>('products', 'readonly', (store) =>
    store.get(id)
  );
  return prod || null;
}

export async function saveProduct(
  product: Partial<ProductAdmin> & { nome: string; categoria: any },
  author: { nome: string; email: string }
): Promise<ProductAdmin> {
  await initializeDatabase();
  const isNew = !product.id;
  const now = new Date().toISOString();

  const id = product.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const existing = product.id ? await getProductById(product.id) : null;

  const finalProduct: ProductAdmin = {
    id,
    codigo: product.codigo || `CJ-${Math.floor(1000 + Math.random() * 9000)}`,
    nome: product.nome.trim(),
    categoria: product.categoria,
    categoriaNome: product.categoriaNome || String(product.categoria),
    descricao: product.descricao || '',
    unidade: product.unidade || 'un',
    permiteDecimal: product.permiteDecimal ?? false,
    quantidadeMinima: product.quantidadeMinima ?? 1,
    incremento: product.incremento ?? 1,
    imagem: product.imagem || '/assets/produtos/placeholder.webp',
    alt: product.alt || product.nome,
    marca: product.marca || '',
    variantes: product.variantes || [],
    especificacoes: product.especificacoes || [],
    demonstrativo: product.demonstrativo ?? true,
    ativo: product.status === 'published',
    status: product.status || 'draft',
    isFeatured: product.isFeatured ?? false,
    fotosAdicionais: product.fotosAdicionais || [],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    updatedBy: author.nome
  };

  await executeTransaction('products', 'readwrite', (store) => store.put(finalProduct));

  await addAuditLog({
    autorEmail: author.email,
    autorNome: author.nome,
    acao: isNew ? 'Cadastrou produto' : 'Atualizou produto',
    entidade: 'produto',
    entidadeId: id,
    entidadeNome: finalProduct.nome,
    detalhes: `Status: ${finalProduct.status}, Categoria: ${finalProduct.categoriaNome}`
  });

  notifyDataChanged();
  return finalProduct;
}

export async function deleteProduct(
  id: string,
  author: { nome: string; email: string },
  permanent = false
): Promise<void> {
  await initializeDatabase();
  const prod = await getProductById(id);
  if (!prod) return;

  if (permanent) {
    await executeTransaction('products', 'readwrite', (store) => store.delete(id));
  } else {
    // Exclusão recuperável (soft delete)
    prod.deletedAt = new Date().toISOString();
    prod.updatedAt = new Date().toISOString();
    prod.updatedBy = author.nome;
    await executeTransaction('products', 'readwrite', (store) => store.put(prod));
  }

  await addAuditLog({
    autorEmail: author.email,
    autorNome: author.nome,
    acao: permanent ? 'Excluiu produto permanentemente' : 'Moveu produto para a lixeira',
    entidade: 'produto',
    entidadeId: id,
    entidadeNome: prod.nome
  });

  notifyDataChanged();
}

export async function restoreProduct(
  id: string,
  author: { nome: string; email: string }
): Promise<void> {
  await initializeDatabase();
  const prod = await executeTransaction<ProductAdmin | undefined>('products', 'readonly', (store) =>
    store.get(id)
  );
  if (!prod) return;

  delete prod.deletedAt;
  prod.updatedAt = new Date().toISOString();
  prod.updatedBy = author.nome;

  await executeTransaction('products', 'readwrite', (store) => store.put(prod));

  await addAuditLog({
    autorEmail: author.email,
    autorNome: author.nome,
    acao: 'Restaurou produto da lixeira',
    entidade: 'produto',
    entidadeId: id,
    entidadeNome: prod.nome
  });

  notifyDataChanged();
}

export async function duplicateProduct(
  id: string,
  author: { nome: string; email: string }
): Promise<ProductAdmin> {
  const original = await getProductById(id);
  if (!original) throw new Error('Produto não encontrado para duplicação');

  const copyData: Partial<ProductAdmin> = {
    ...original,
    id: undefined,
    codigo: `${original.codigo}-COPIA`,
    nome: `${original.nome} (Cópia)`,
    status: 'draft',
    ativo: false
  };

  return saveProduct(copyData as any, author);
}

export async function batchUpdateProducts(
  ids: string[],
  updates: Partial<ProductAdmin>,
  author: { nome: string; email: string }
): Promise<void> {
  await initializeDatabase();
  const now = new Date().toISOString();

  for (const id of ids) {
    const prod = await getProductById(id);
    if (prod) {
      const updated: ProductAdmin = {
        ...prod,
        ...updates,
        updatedAt: now,
        updatedBy: author.nome
      };
      if (updates.status) {
        updated.ativo = updates.status === 'published';
      }
      await executeTransaction('products', 'readwrite', (store) => store.put(updated));
    }
  }

  await addAuditLog({
    autorEmail: author.email,
    autorNome: author.nome,
    acao: `Alteração em lote (${ids.length} produtos)`,
    entidade: 'produto',
    detalhes: JSON.stringify(updates)
  });

  notifyDataChanged();
}

// ==========================================================
// API DE CATEGORIAS
// ==========================================================
export async function getCategories(includeHidden = false): Promise<CategoryAdmin[]> {
  await initializeDatabase();
  const all = await executeTransaction<CategoryAdmin[]>('categories', 'readonly', (store) =>
    store.getAll()
  );

  return all
    .filter((c) => (includeHidden ? !c.deletedAt : !c.deletedAt && c.ativo))
    .sort((a, b) => a.ordem - b.ordem);
}

export async function getCategoryById(id: string): Promise<CategoryAdmin | null> {
  await initializeDatabase();
  const cat = await executeTransaction<CategoryAdmin | undefined>(
    'categories',
    'readonly',
    (store) => store.get(id)
  );
  return cat || null;
}

export async function saveCategory(
  category: Partial<CategoryAdmin> & { nome: string },
  author: { nome: string; email: string }
): Promise<CategoryAdmin> {
  await initializeDatabase();
  const isNew = !category.id;

  const id =
    category.id ||
    category.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-');

  const existing = category.id ? await getCategoryById(category.id) : null;

  const finalCat: CategoryAdmin = {
    id,
    nome: category.nome.trim(),
    descricao: category.descricao || '',
    imagem: category.imagem || '/assets/categorias/placeholder.webp',
    icone: category.icone || 'Building2',
    thiingId: category.thiingId,
    ativo: category.ativo ?? true,
    showOnHome: category.showOnHome ?? true,
    ordem: category.ordem ?? (existing?.ordem || 99)
  };

  await executeTransaction('categories', 'readwrite', (store) => store.put(finalCat));

  await addAuditLog({
    autorEmail: author.email,
    autorNome: author.nome,
    acao: isNew ? 'Criou categoria' : 'Atualizou categoria',
    entidade: 'categoria',
    entidadeId: id,
    entidadeNome: finalCat.nome
  });

  notifyDataChanged();
  return finalCat;
}

/**
 * Conta produtos associados à categoria para validação antes de excluir
 */
export async function countProductsInCategory(categoryId: string): Promise<number> {
  const allProds = await getProducts(true);
  return allProds.filter((p) => p.categoria === categoryId).length;
}

/**
 * Exclui categoria transferindo os produtos vinculados para outra categoria segura
 */
export async function deleteCategoryWithTransfer(
  categoryId: string,
  transferToCategoryId: string,
  author: { nome: string; email: string }
): Promise<void> {
  await initializeDatabase();
  const cat = await getCategoryById(categoryId);
  if (!cat) return;

  // Transfere produtos
  const allProds = await getProducts(true);
  const targetCat = await getCategoryById(transferToCategoryId);
  const affectedProds = allProds.filter((p) => p.categoria === categoryId);

  for (const prod of affectedProds) {
    prod.categoria = transferToCategoryId as any;
    prod.categoriaNome = targetCat?.nome || transferToCategoryId;
    prod.updatedAt = new Date().toISOString();
    prod.updatedBy = author.nome;
    await executeTransaction('products', 'readwrite', (store) => store.put(prod));
  }

  // Remove categoria
  await executeTransaction('categories', 'readwrite', (store) => store.delete(categoryId));

  await addAuditLog({
    autorEmail: author.email,
    autorNome: author.nome,
    acao: 'Excluiu categoria com transferência de produtos',
    entidade: 'categoria',
    entidadeId: categoryId,
    entidadeNome: cat.nome,
    detalhes: `${affectedProds.length} produto(s) transferido(s) para ${targetCat?.nome || transferToCategoryId}`
  });

  notifyDataChanged();
}

// ==========================================================
// API DE DADOS DA LOJA E HORÁRIOS
// ==========================================================
export async function getStoreSettings(): Promise<StoreSettingsAdmin> {
  await initializeDatabase();
  const settings = await executeTransaction<StoreSettingsAdmin | undefined>(
    'store_settings',
    'readonly',
    (store) => store.get('config_default')
  );

  return settings || (companyData as any);
}

export async function saveStoreSettings(
  settings: Partial<StoreSettingsAdmin>,
  author: { nome: string; email: string }
): Promise<StoreSettingsAdmin> {
  await initializeDatabase();
  const current = await getStoreSettings();

  const finalSettings: StoreSettingsAdmin & { id: string } = {
    ...current,
    ...settings,
    id: 'config_default'
  };

  await executeTransaction('store_settings', 'readwrite', (store) => store.put(finalSettings));

  await addAuditLog({
    autorEmail: author.email,
    autorNome: author.nome,
    acao: 'Atualizou dados e horários da loja',
    entidade: 'loja'
  });

  notifyDataChanged();
  return finalSettings;
}

// ==========================================================
// API DE APARÊNCIA DO SITE
// ==========================================================
export async function getSiteAppearance(): Promise<SiteAppearanceAdmin> {
  await initializeDatabase();
  const appearance = await executeTransaction<SiteAppearanceAdmin | undefined>(
    'site_appearance',
    'readonly',
    (store) => store.get('appearance_default')
  );

  return (
    appearance || {
      heroEyebrow: 'CONSTRU-J',
      heroHeadline: 'Tudo para construir e reformar, em um só lugar.',
      heroSubtitle: 'Materiais de construção e acabamentos em Rio Pardo de Minas.',
      heroBtnPrimaryText: 'Explorar produtos',
      heroBtnSecondaryText: 'Pedir orçamento',
      heroFacadeImage: '/assets/fotos/fachada-constru-j-limpa.jpg',
      featuredProductIds: [],
      galleryPhotos: []
    }
  );
}

export async function saveSiteAppearance(
  appearance: Partial<SiteAppearanceAdmin>,
  author: { nome: string; email: string }
): Promise<SiteAppearanceAdmin> {
  await initializeDatabase();
  const current = await getSiteAppearance();

  const finalAppearance: SiteAppearanceAdmin & { id: string } = {
    ...current,
    ...appearance,
    id: 'appearance_default',
    updatedAt: new Date().toISOString(),
    updatedBy: author.nome
  };

  await executeTransaction('site_appearance', 'readwrite', (store) => store.put(finalAppearance));

  await addAuditLog({
    autorEmail: author.email,
    autorNome: author.nome,
    acao: 'Atualizou aparência do site',
    entidade: 'aparencia'
  });

  notifyDataChanged();
  return finalAppearance;
}

// ==========================================================
// API DE USUÁRIOS E EQUIPE
// ==========================================================
export async function getAdminUsers(): Promise<AdminUser[]> {
  await initializeDatabase();
  return executeTransaction<AdminUser[]>('admin_users', 'readonly', (store) => store.getAll());
}

export async function saveAdminUser(
  user: Partial<AdminUser> & { nome: string; email: string; papel: 'admin' | 'editor' },
  author: { nome: string; email: string }
): Promise<AdminUser> {
  await initializeDatabase();
  const isNew = !user.id;
  const id = user.id || `user_${Date.now()}`;

  const finalUser: AdminUser = {
    id,
    nome: user.nome.trim(),
    email: user.email.trim().toLowerCase(),
    papel: user.papel,
    ativo: user.ativo ?? true,
    criadoEm: user.criadoEm || new Date().toISOString()
  };

  await executeTransaction('admin_users', 'readwrite', (store) => store.put(finalUser));

  await addAuditLog({
    autorEmail: author.email,
    autorNome: author.nome,
    acao: isNew ? 'Cadastrou novo membro da equipe' : 'Atualizou membro da equipe',
    entidade: 'equipe',
    entidadeId: id,
    entidadeNome: finalUser.nome,
    detalhes: `Papel: ${finalUser.papel}`
  });

  notifyDataChanged();
  return finalUser;
}

export async function deleteAdminUser(
  id: string,
  author: { nome: string; email: string }
): Promise<void> {
  await initializeDatabase();
  const users = await getAdminUsers();
  const userToDelete = users.find((u) => u.id === id);

  if (!userToDelete) return;

  // Proteção: não permitir remover o último administrador ativo
  if (userToDelete.papel === 'admin') {
    const adminCount = users.filter((u) => u.papel === 'admin' && u.ativo).length;
    if (adminCount <= 1) {
      throw new Error('Não é permitido excluir o único administrador ativo do sistema.');
    }
  }

  await executeTransaction('admin_users', 'readwrite', (store) => store.delete(id));

  await addAuditLog({
    autorEmail: author.email,
    autorNome: author.nome,
    acao: 'Removeu membro da equipe',
    entidade: 'equipe',
    entidadeId: id,
    entidadeNome: userToDelete.nome
  });

  notifyDataChanged();
}

// ==========================================================
// API DE LOGS DE AUDITORIA
// ==========================================================
export async function getAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  await initializeDatabase();
  const all = await executeTransaction<AuditLogEntry[]>('audit_logs', 'readonly', (store) =>
    store.getAll()
  );

  return all
    .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
    .slice(0, limit);
}

export async function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'dataHora'>): Promise<void> {
  try {
    const fullEntry: AuditLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      dataHora: new Date().toISOString(),
      ...entry
    };
    await executeTransaction('audit_logs', 'readwrite', (store) => store.put(fullEntry));
  } catch (err) {
    console.error('Falha ao salvar log de auditoria:', err);
  }
}
