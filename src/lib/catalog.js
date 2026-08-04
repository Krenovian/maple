/** Default categories used for seeding only — live list comes from the DB. */
export const DEFAULT_PRODUCT_CATEGORIES = [
  'Stone',
  'Timber',
  'Lighting',
  'Metals',
  'Fabrics',
  'Hardware',
  'Finishes',
  'Tiles',
  'Flooring',
  'Materials',
  'Other',
];

export const DEFAULT_PROJECT_CATEGORIES = [
  'Residential',
  'Interior',
  'Commercial',
  'Landscape',
  'Institutional',
];

export function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseSpecs(value) {
  const list = parseJsonArray(value);
  return list
    .map((row) => {
      if (!row || typeof row !== 'object') return null;
      const label = String(row.label || '').trim();
      const val = String(row.value || '').trim();
      if (!label || !val) return null;
      return { label, value: val };
    })
    .filter(Boolean);
}

export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

/** Order filter chips: managed categories first, then any extras found on items. */
export function mergeCategoryFilters(managedNames = [], usedNames = []) {
  const present = new Set(usedNames.filter(Boolean));
  const ordered = managedNames.filter((c) => present.has(c));
  const extras = [...present].filter((c) => !managedNames.includes(c)).sort();
  return ['All', ...ordered, ...extras];
}
