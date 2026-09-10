import { getPrisma } from '@/lib/prisma';
import {
  SITE_IMAGE_FIELDS,
  ALL_SETTING_KEYS,
  DEFAULT_HERO_IMAGE,
  DEFAULT_HERO_IMAGE_ALT,
  getDefaultSiteImages,
  parseHeroImages,
  resolveHeroImages,
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
  const heroImages = resolveHeroImages(images);
  return {
    heroImage: heroImages[0],
    heroImages,
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
    let url = nextValues[field.id]?.trim() || field.defaultUrl;

    if (field.galleryId) {
      const gallery = parseHeroImages(nextValues[field.galleryId]);
      if (gallery.length) {
        url = gallery[0];
        updates.push(setSiteSetting(field.galleryId, JSON.stringify(gallery)));
      } else {
        updates.push(setSiteSetting(field.galleryId, '[]'));
      }
    }

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

  const removedUrls = [];

  for (const field of SITE_IMAGE_FIELDS) {
    const nextUrl = nextValues[field.id]?.trim() || defaults[field.id];
    if (current[field.id] && current[field.id] !== nextUrl) {
      removedUrls.push(current[field.id]);
    }

    if (field.galleryId) {
      const prevGallery = parseHeroImages(current[field.galleryId]);
      const nextGallery = parseHeroImages(nextValues[field.galleryId]);
      for (const url of prevGallery) {
        if (!nextGallery.includes(url)) removedUrls.push(url);
      }
    }
  }

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
