export const SITE_IMAGE_FIELDS = [
  {
    id: 'hero_image',
    altId: 'hero_image_alt',
    section: 'Homepage',
    label: 'Hero background',
    usedIn: 'Full-bleed background in the homepage hero',
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
];

export const ALL_SETTING_KEYS = SITE_IMAGE_FIELDS.flatMap((field) =>
  field.altId ? [field.id, field.altId] : [field.id]
);

export const DEFAULT_HERO_IMAGE = '/images/hero.png';
export const DEFAULT_HERO_IMAGE_ALT = 'Residence by MAPLE INFRA & INTERIORS';

export function getDefaultSiteImages() {
  const defaults = {};
  for (const field of SITE_IMAGE_FIELDS) {
    defaults[field.id] = field.defaultUrl;
    if (field.altId) defaults[field.altId] = field.defaultAlt;
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
