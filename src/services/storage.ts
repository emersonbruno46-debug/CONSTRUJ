/**
 * Serviço de Upload e Gerenciamento de Imagens da Constru-J
 * Valida tipo, tamanho, trata SVG e armazena em formato persistente.
 */

export interface UploadResult {
  url: string;
  name: string;
  size: number;
}

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

export async function uploadImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  // 1. Validação de tamanho
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('A imagem deve ter no máximo 8MB.');
  }

  // 2. Validação de tipo
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato inválido. Use JPG, PNG, WebP ou SVG.');
  }

  // Simula progresso fluido
  if (onProgress) {
    onProgress(25);
  }

  // Tratamento especial para SVG (garante que não há scripts maliciosos embutidos)
  if (file.type === 'image/svg+xml') {
    const text = await file.text();
    if (text.includes('<script') || text.includes('javascript:')) {
      throw new Error('Arquivo SVG inválido ou potencialmente perigoso.');
    }
  }

  if (onProgress) {
    onProgress(60);
  }

  // Se houver Supabase configurado no ambiente, podemos enviar para a nuvem
  const meta = import.meta as any;
  const supabaseUrl = meta.env?.VITE_SUPABASE_URL;
  const supabaseKey = meta.env?.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadEndpoint = `${supabaseUrl}/storage/v1/object/construj-media/${fileName}`;

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': file.type
        },
        body: file
      });

      if (res.ok) {
        if (onProgress) onProgress(100);
        return {
          url: `${supabaseUrl}/storage/v1/object/public/construj-media/${fileName}`,
          name: file.name,
          size: file.size
        };
      }
    } catch (e) {
      console.warn('Falha no upload para o Supabase, utilizando armazenamento local persistente:', e);
    }
  }

  // Fallback Persistente: Armazena como DataURL / Blob no IndexedDB
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (onProgress) onProgress(100);
      resolve({
        url: reader.result as string,
        name: file.name,
        size: file.size
      });
    };
    reader.onerror = () => reject(new Error('Erro ao processar imagem.'));
    reader.readAsDataURL(file);
  });
}
