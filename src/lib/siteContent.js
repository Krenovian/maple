import { getPrisma } from '@/lib/prisma';
import { setSiteSetting, getSiteSetting } from '@/lib/siteSettings';
import {
  HOMEPAGE_CONTENT_FIELDS,
  HOMEPAGE_CONTENT_KEYS,
  getDefaultHomepageContent,
  parseHomepageContent,
} from '@/lib/siteContentFields';

export {
  HOMEPAGE_CONTENT_FIELDS,
  getDefaultHomepageContent,
  groupHomepageContentFields,
  parseHomepageContent,
  buildManifestoStats,
} from '@/lib/siteContentFields';

export async function getHomepageContentRaw() {
  const prisma = getPrisma();
  const defaults = getDefaultHomepageContent();
  let stored = {};

  if (typeof prisma.siteSetting?.findMany === 'function') {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: HOMEPAGE_CONTENT_KEYS } },
    });
    stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } else {
    for (const key of HOMEPAGE_CONTENT_KEYS) {
      const value = await getSiteSetting(key);
      if (value) stored[key] = value;
    }
  }

  return { ...defaults, ...stored };
}

export async function getHomepageContent() {
  return parseHomepageContent(await getHomepageContentRaw());
}

export async function setHomepageContent(nextValues) {
  const defaults = getDefaultHomepageContent();
  const updates = HOMEPAGE_CONTENT_FIELDS.map((field) => {
    const value = nextValues[field.id]?.trim?.() ?? nextValues[field.id] ?? defaults[field.id];
    return setSiteSetting(field.id, String(value ?? defaults[field.id]));
  });

  await Promise.all(updates);
  return getHomepageContent();
}
