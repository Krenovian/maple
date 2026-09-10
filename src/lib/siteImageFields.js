export const HERO_IMAGES_KEY = 'hero_images';
export const HERO_IMAGES_MAX = 3;

export const SITE_IMAGE_FIELDS = [
  {
    id: 'hero_image',
    altId: 'hero_image_alt',
    galleryId: HERO_IMAGES_KEY,
    galleryMax: HERO_IMAGES_MAX,
    section: 'Homepage',
    label: 'Hero background',
    usedIn: 'Full-bleed background in the homepage hero — add up to 3 images to loop',
    defaultUrl: '/images/hero.png',
    defaultAlt: 'Residence by MAPLE INFRA & INTERIORS',
    folder: 'maple/homepage',
  },
  {
    id: 'manifesto_image',
    altId: 'manifesto_image_alt',
    section: 'Homepage',
    label: 'Ethos image',
    usedIn: 'Image card in the homepage Ethos / Practice bento grid',
    defaultUrl: '/images/interior.png',
    defaultAlt: 'Warm oak and travertine interior detail',
    folder: 'maple/homepage',
  },
  {
    id: 'closing_quote_image',
    altId: 'closing_quote_image_alt',
    section: 'Homepage',
    label: 'Testimonial image',
    usedIn: 'Quote section image above the homepage closing CTA',
    defaultUrl: '/images/bedroom.png',
    defaultAlt: 'Completed residence interior',
    folder: 'maple/homepage',
  },
  {
    id: 'capability_architecture_image',
    altId: 'capability_architecture_image_alt',
    section: 'Homepage capabilities',
    label: 'Architecture',
    usedIn: 'Architecture card in the homepage capabilities stack',
    defaultUrl: '/images/hero.png',
    defaultAlt: 'Architecture',
    folder: 'maple/capabilities',
  },
  {
    id: 'capability_engineering_image',
    altId: 'capability_engineering_image_alt',
    section: 'Homepage capabilities',
    label: 'Engineering',
    usedIn: 'Engineering card in the homepage capabilities stack',
    defaultUrl: '/images/bedroom.png',
    defaultAlt: 'Engineering',
    folder: 'maple/capabilities',
  },
  {
    id: 'capability_interiors_image',
    altId: 'capability_interiors_image_alt',
    section: 'Homepage capabilities',
    label: 'Interiors',
    usedIn: 'Interiors card in the homepage capabilities stack',
    defaultUrl: '/images/interior.png',
    defaultAlt: 'Interiors',
    folder: 'maple/capabilities',
  },
  {
    id: 'capability_contracting_image',
    altId: 'capability_contracting_image_alt',
    section: 'Homepage capabilities',
    label: 'Contracting',
    usedIn: 'Contracting card in the homepage capabilities stack',
    defaultUrl: '/images/pool.png',
    defaultAlt: 'Contracting',
    folder: 'maple/capabilities',
  },
  {
    id: 'capability_consultancy_image',
    altId: 'capability_consultancy_image_alt',
    section: 'Homepage capabilities',
    label: 'Consultancy',
    usedIn: 'Consultancy card in the homepage capabilities stack',
    defaultUrl: '/images/hero.png',
    defaultAlt: 'Consultancy',
    folder: 'maple/capabilities',
  },
  {
    id: 'capability_renovation_image',
    altId: 'capability_renovation_image_alt',
    section: 'Homepage capabilities',
    label: 'Renovation & Remodeling',
    usedIn: 'Renovation & Remodeling card in the homepage capabilities stack',
    defaultUrl: '/images/bedroom.png',
    defaultAlt: 'Renovation & Remodeling',
    folder: 'maple/capabilities',
  },
  {
    id: 'capability_landscaping_image',
    altId: 'capability_landscaping_image_alt',
    section: 'Homepage capabilities',
    label: 'Landscaping & Hospitality',
    usedIn: 'Landscaping & Hospitality card in the homepage capabilities stack',
    defaultUrl: '/images/pool.png',
    defaultAlt: 'Landscaping & Hospitality',
    folder: 'maple/capabilities',
  },
  {
    id: 'about_story_image',
    altId: 'about_story_image_alt',
    section: 'About page',
    label: 'Our story',
    usedIn: 'Side image beside the Our story copy on the About page',
    defaultUrl: '/images/interior.png',
    defaultAlt: 'Maple project interior',
    folder: 'maple/about',
  },
  {
    id: 'about_team_architecture_image',
    altId: 'about_team_architecture_image_alt',
    section: 'About page',
    label: 'Team — Architecture',
    usedIn: 'Architecture team card on the About page',
    defaultUrl: '/images/interior.png',
    defaultAlt: 'Architecture',
    folder: 'maple/about',
  },
  {
    id: 'about_team_engineering_image',
    altId: 'about_team_engineering_image_alt',
    section: 'About page',
    label: 'Team — Engineering',
    usedIn: 'Engineering team card on the About page',
    defaultUrl: '/images/bedroom.png',
    defaultAlt: 'Engineering',
    folder: 'maple/about',
  },
  {
    id: 'about_team_interiors_image',
    altId: 'about_team_interiors_image_alt',
    section: 'About page',
    label: 'Team — Interiors & retail',
    usedIn: 'Interiors team card on the About page',
    defaultUrl: '/images/pool.png',
    defaultAlt: 'Interiors & retail',
    folder: 'maple/about',
  },
  {
    id: 'services_01_architecture_image',
    altId: 'services_01_architecture_image_alt',
    section: 'Services page',
    label: 'Architectural design',
    usedIn: 'Services page — Architectural Design row',
    defaultUrl: '/images/hero.png',
    defaultAlt: 'Architectural Design',
    folder: 'maple/services',
  },
  {
    id: 'services_02_interiors_image',
    altId: 'services_02_interiors_image_alt',
    section: 'Services page',
    label: 'Interior design',
    usedIn: 'Services page — Interior Design row',
    defaultUrl: '/images/interior.png',
    defaultAlt: 'Interior Design',
    folder: 'maple/services',
  },
  {
    id: 'services_03_engineering_image',
    altId: 'services_03_engineering_image_alt',
    section: 'Services page',
    label: 'Structural & engineering',
    usedIn: 'Services page — Structural & Engineering row',
    defaultUrl: '/images/bedroom.png',
    defaultAlt: 'Structural & Engineering',
    folder: 'maple/services',
  },
  {
    id: 'services_04_consultancy_image',
    altId: 'services_04_consultancy_image_alt',
    section: 'Services page',
    label: 'Project consultancy',
    usedIn: 'Services page — Project Consultancy row',
    defaultUrl: '/images/pool.png',
    defaultAlt: 'Project Consultancy',
    folder: 'maple/services',
  },
  {
    id: 'services_05_contracting_image',
    altId: 'services_05_contracting_image_alt',
    section: 'Services page',
    label: 'Civil & structural contracting',
    usedIn: 'Services page — Civil & Structural Contracting row',
    defaultUrl: '/images/hero.png',
    defaultAlt: 'Civil & Structural Contracting',
    folder: 'maple/services',
  },
  {
    id: 'services_06_interior_contracting_image',
    altId: 'services_06_interior_contracting_image_alt',
    section: 'Services page',
    label: 'Interior contracting & fit-out',
    usedIn: 'Services page — Interior Contracting & Fit-Out row',
    defaultUrl: '/images/interior.png',
    defaultAlt: 'Interior Contracting & Fit-Out',
    folder: 'maple/services',
  },
  {
    id: 'services_07_renovation_image',
    altId: 'services_07_renovation_image_alt',
    section: 'Services page',
    label: 'Renovation & remodeling',
    usedIn: 'Services page — Renovation & Remodeling row',
    defaultUrl: '/images/bedroom.png',
    defaultAlt: 'Renovation & Remodeling',
    folder: 'maple/services',
  },
  {
    id: 'services_08_landscaping_image',
    altId: 'services_08_landscaping_image_alt',
    section: 'Services page',
    label: 'Landscaping & hospitality',
    usedIn: 'Services page — Landscaping & Hospitality row',
    defaultUrl: '/images/pool.png',
    defaultAlt: 'Landscaping & Hospitality',
    folder: 'maple/services',
  },
];

export const ALL_SETTING_KEYS = [
  ...SITE_IMAGE_FIELDS.flatMap((field) => {
    const keys = field.altId ? [field.id, field.altId] : [field.id];
    if (field.galleryId) keys.push(field.galleryId);
    return keys;
  }),
];

export const DEFAULT_HERO_IMAGE = '/images/hero.png';
export const DEFAULT_HERO_IMAGE_ALT = 'Residence by MAPLE INFRA & INTERIORS';

export function parseHeroImages(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter(Boolean).slice(0, HERO_IMAGES_MAX);
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, HERO_IMAGES_MAX) : [];
  } catch {
    return [];
  }
}

export function resolveHeroImages(images) {
  const gallery = parseHeroImages(images?.[HERO_IMAGES_KEY]);
  if (gallery.length) return gallery;
  if (images?.hero_image) return [images.hero_image];
  return [DEFAULT_HERO_IMAGE];
}

export function getDefaultSiteImages() {
  const defaults = {};
  for (const field of SITE_IMAGE_FIELDS) {
    defaults[field.id] = field.defaultUrl;
    if (field.altId) defaults[field.altId] = field.defaultAlt;
    if (field.galleryId) defaults[field.galleryId] = '[]';
  }
  return defaults;
}

export function groupSiteImageFields() {
  const groups = [];
  for (const field of SITE_IMAGE_FIELDS) {
    let group = groups.find((g) => g.section === field.section);
    if (!group) {
      group = { section: field.section, fields: [] };
      groups.push(group);
    }
    group.fields.push(field);
  }
  return groups;
}

export function imageAltKey(imageKey) {
  return `${imageKey}_alt`;
}
