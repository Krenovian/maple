import { getPrisma } from '@/lib/prisma';

export const SHOP_SETTING_FIELDS = [
  {
    id: 'shop_promo_enabled',
    type: 'boolean',
    section: 'Promo strip',
    label: 'Show promo strip',
    usedIn: 'Rotating offer bar on the shop page',
    defaultValue: 'true',
  },
  {
    id: 'shop_promo_line_1',
    type: 'text',
    section: 'Promo strip',
    label: 'Promo line 1',
    usedIn: 'First message in the promo strip',
    defaultValue: 'THE DECOR CLUB — curated antique brass, blue pottery & premium décor',
  },
  {
    id: 'shop_promo_line_2',
    type: 'text',
    section: 'Promo strip',
    label: 'Promo line 2',
    usedIn: 'Second rotating promo message',
    defaultValue: 'Limited finds · Thoughtfully curated · Delivery across Kerala',
  },
  {
    id: 'shop_promo_line_3',
    type: 'text',
    section: 'Promo strip',
    label: 'Promo line 3',
    usedIn: 'Third rotating promo message',
    defaultValue: '',
  },
  {
    id: 'shop_banner_enabled',
    type: 'boolean',
    section: 'Offer banner',
    label: 'Show offer banner',
    usedIn: 'Large promotional banner on the shop page',
    defaultValue: 'true',
  },
  {
    id: 'shop_banner_image',
    type: 'image',
    section: 'Offer banner',
    label: 'Banner image',
    usedIn: 'Background/visual for the offer banner',
    defaultValue: '/images/interior.png',
    folder: 'maple/shop',
  },
  {
    id: 'shop_banner_image_alt',
    type: 'text',
    section: 'Offer banner',
    label: 'Banner image alt',
    usedIn: 'Accessibility text for banner image',
    defaultValue: 'THE DECOR CLUB curated décor',
  },
  {
    id: 'shop_banner_eyebrow',
    type: 'text',
    section: 'Offer banner',
    label: 'Banner eyebrow',
    usedIn: 'Small label above banner headline',
    defaultValue: 'THE DECOR CLUB',
  },
  {
    id: 'shop_banner_title',
    type: 'text',
    section: 'Offer banner',
    label: 'Banner headline',
    usedIn: 'Main headline on the offer banner',
    defaultValue: 'Curated. Distinctive. Timeless.',
  },
  {
    id: 'shop_banner_text',
    type: 'text',
    section: 'Offer banner',
    label: 'Banner description',
    usedIn: 'Supporting copy on the offer banner',
    defaultValue:
      'Antique brass, imported blue pottery, premium crockery and lifestyle objects — carefully sourced for distinctive homes.',
  },
  {
    id: 'shop_banner_cta_label',
    type: 'text',
    section: 'Offer banner',
    label: 'Banner button label',
    usedIn: 'CTA button on the offer banner',
    defaultValue: 'Shop the collection',
  },
  {
    id: 'shop_banner_cta_href',
    type: 'text',
    section: 'Offer banner',
    label: 'Banner button link',
    usedIn: 'URL for the banner CTA',
    defaultValue: '/products',
  },
];

export const SHOP_SETTING_KEYS = SHOP_SETTING_FIELDS.map((field) => field.id);

export function getDefaultShopSettings() {
  const defaults = {};
  for (const field of SHOP_SETTING_FIELDS) {
    defaults[field.id] = field.defaultValue;
  }
  return defaults;
}

export function groupShopSettingFields() {
  const groups = [];
  for (const field of SHOP_SETTING_FIELDS) {
    let group = groups.find((entry) => entry.section === field.section);
    if (!group) {
      group = { section: field.section, fields: [] };
      groups.push(group);
    }
    group.fields.push(field);
  }
  return groups;
}

export function parseShopSettings(raw = {}) {
  const defaults = getDefaultShopSettings();
  const merged = { ...defaults, ...raw };

  return {
    ...merged,
    shop_promo_enabled: merged.shop_promo_enabled === 'true',
    shop_banner_enabled: merged.shop_banner_enabled === 'true',
    promoLines: [merged.shop_promo_line_1, merged.shop_promo_line_2, merged.shop_promo_line_3].filter(
      Boolean
    ),
  };
}

export async function getShopSettingsRaw() {
  const prisma = getPrisma();
  const defaults = getDefaultShopSettings();
  let stored = {};

  if (typeof prisma.siteSetting?.findMany === 'function') {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: SHOP_SETTING_KEYS } },
    });
    stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } else {
    for (const key of SHOP_SETTING_KEYS) {
      const rows = await prisma.$queryRaw`
        SELECT value FROM SiteSetting WHERE key = ${key} LIMIT 1
      `;
      if (rows[0]?.value) stored[key] = rows[0].value;
    }
  }

  return { ...defaults, ...stored };
}

export async function getShopSettings() {
  return parseShopSettings(await getShopSettingsRaw());
}

async function setShopSetting(key, value) {
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

export async function setShopSettings(nextValues) {
  const current = await getShopSettingsRaw();
  const defaults = getDefaultShopSettings();
  const updates = [];

  for (const field of SHOP_SETTING_FIELDS) {
    let value = nextValues[field.id];
    if (field.type === 'boolean') {
      value = value === true || value === 'true' ? 'true' : 'false';
    } else {
      value = String(value ?? '').trim() || defaults[field.id];
    }
    updates.push(setShopSetting(field.id, value));
  }

  await Promise.all(updates);

  const removedUrls = SHOP_SETTING_FIELDS.filter((field) => field.type === 'image')
    .map((field) => field.id)
    .filter((id) => {
      const nextUrl = nextValues[id]?.trim?.() || nextValues[id] || defaults[id];
      return current[id] && current[id] !== nextUrl;
    })
    .map((id) => current[id]);

  return { settings: await getShopSettings(), removedUrls };
}

export const SHOP_IMAGE_KEYS = SHOP_SETTING_FIELDS.filter((field) => field.type === 'image').map(
  (field) => field.id
);
