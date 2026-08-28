import { getPrisma } from '@/lib/prisma';
import {
  SITE_IMAGE_FIELDS,
  ALL_SETTING_KEYS,
  DEFAULT_HERO_IMAGE,
  DEFAULT_HERO_IMAGE_ALT,
  getDefaultSiteImages,
} from '@/lib/siteImageFields';

export {
  SITE_IMAGE_FIELDS,
  DEFAULT_HERO_IMAGE,
  DEFAULT_HERO_IMAGE_ALT,
  getDefaultSiteImages,
  groupSiteImageFields,
  imageAltKey,
} from '@/lib/siteImageFields';

export async function getSiteSetting(key) {
  const prisma = getPrisma();

  if (typeof prisma.siteSetting?.findUnique === 'function') {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? null;
  }

  const rows = await prisma.$queryRaw`
    SELECT value FROM SiteSetting WHERE key = ${key} LIMIT 1
  `;
  return rows[0]?.value ?? null;
}

export async function getSiteImages() {
  const prisma = getPrisma();
  const defaults = getDefaultSiteImages();
  let stored = {};

  if (typeof prisma.siteSetting?.findMany === 'function') {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ALL_SETTING_KEYS } },
    });
    stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } else {
    for (const key of ALL_SETTING_KEYS) {
      const value = await getSiteSetting(key);
      if (value) stored[key] = value;
    }
  }

  return { ...defaults, ...stored };
}

export async function getHeroSettings() {
  const images = await getSiteImages();
  return {
    heroImage: images.hero_image,
    heroImageAlt: images.hero_image_alt,
  };
}

export async function setSiteSetting(key, value) {
  const prisma = getPrisma();

  if (typeof prisma.siteSetting?.upsert === 'function') {
    return prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  await prisma.$executeRaw`
    INSERT INTO SiteSetting (key, value, updatedAt)
    VALUES (${key}, ${value}, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updatedAt = datetime('now')
  `;
}

export async function setSiteImages(nextValues) {
  const current = await getSiteImages();
  const defaults = getDefaultSiteImages();
  const updates = [];

  for (const field of SITE_IMAGE_FIELDS) {
    const url = nextValues[field.id]?.trim() || field.defaultUrl;
    if (!url) throw new Error(`${field.label} image is required`);

    updates.push(setSiteSetting(field.id, url));

    if (field.altId) {
      updates.push(
        setSiteSetting(
          field.altId,
          nextValues[field.altId]?.trim() || field.defaultAlt
        )
      );
    }
  }

  await Promise.all(updates);

  const removedUrls = SITE_IMAGE_FIELDS.map((field) => field.id)
    .filter((id) => {
      const nextUrl = nextValues[id]?.trim() || defaults[id];
      return current[id] && current[id] !== nextUrl;
    })
    .map((id) => current[id]);

  return { images: await getSiteImages(), removedUrls };
}

export async function setHeroSettings({ heroImage, heroImageAlt }) {
  const images = await getSiteImages();
  return setSiteImages({
    ...images,
    hero_image: heroImage,
    hero_image_alt: heroImageAlt,
  });
}
