export function normalizeString(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function matchesSearch(text: string, query: string): boolean {
  if (!query) return true;
  const normText = normalizeString(text);
  const normQuery = normalizeString(query);
  return normText.includes(normQuery);
}
