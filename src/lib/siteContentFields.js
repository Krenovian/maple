export const HOMEPAGE_CONTENT_FIELDS = [
  {
    id: 'manifesto_eyebrow',
    section: 'Ethos / Practice',
    label: 'Eyebrow',
    usedIn: 'Small label above the Ethos section',
    defaultValue: 'The Practice',
    multiline: false,
  },
  {
    id: 'manifesto_index',
    section: 'Ethos / Practice',
    label: 'Section index',
    usedIn: 'Index label shown beside the eyebrow',
    defaultValue: '01 — Ethos',
    multiline: false,
  },
  {
    id: 'manifesto_statement',
    section: 'Ethos / Practice',
    label: 'Main statement',
    usedIn: 'Large headline in the Ethos bento grid. Use <em> for emphasis.',
    defaultValue:
      'We deliver <em>practical</em>, sustainable and aesthetically refined spaces — tailored to every client.',
    multiline: true,
  },
  {
    id: 'manifesto_copy_1',
    section: 'Ethos / Practice',
    label: 'Intro copy',
    usedIn: 'First text card in the Ethos bento grid',
    defaultValue:
      'MAPLE INFRA & INTERIORS — formerly DE MAPLE Architects & Engineers — with a team of 13 professionals. Integrated capability: Architecture + Engineering + Interiors + Contracting + Consultancy. Based in Maranchery, Malappuram, with projects delivered across Kerala, Bengaluru and Qatar.',
    multiline: true,
  },
  {
    id: 'manifesto_stat_1_value',
    section: 'Ethos / Practice — stats',
    label: 'Stat 1 — number',
    usedIn: 'First stat value',
    defaultValue: '200',
    multiline: false,
  },
  {
    id: 'manifesto_stat_1_suffix',
    section: 'Ethos / Practice — stats',
    label: 'Stat 1 — suffix',
    usedIn: 'Optional suffix (e.g. +)',
    defaultValue: '+',
    multiline: false,
  },
  {
    id: 'manifesto_stat_1_label',
    section: 'Ethos / Practice — stats',
    label: 'Stat 1 — label',
    usedIn: 'Label under the first stat',
    defaultValue: 'Projects completed',
    multiline: false,
  },
  {
    id: 'manifesto_stat_2_value',
    section: 'Ethos / Practice — stats',
    label: 'Stat 2 — number',
    usedIn: 'Second stat value',
    defaultValue: '15',
    multiline: false,
  },
  {
    id: 'manifesto_stat_2_suffix',
    section: 'Ethos / Practice — stats',
    label: 'Stat 2 — suffix',
    usedIn: 'Optional suffix',
    defaultValue: '',
    multiline: false,
  },
  {
    id: 'manifesto_stat_2_label',
    section: 'Ethos / Practice — stats',
    label: 'Stat 2 — label',
    usedIn: 'Label under the second stat',
    defaultValue: 'Years in practice',
    multiline: false,
  },
  {
    id: 'manifesto_stat_3_value',
    section: 'Ethos / Practice — stats',
    label: 'Stat 3 — number',
    usedIn: 'Third stat value',
    defaultValue: '13',
    multiline: false,
  },
  {
    id: 'manifesto_stat_3_suffix',
    section: 'Ethos / Practice — stats',
    label: 'Stat 3 — suffix',
    usedIn: 'Optional suffix',
    defaultValue: '',
    multiline: false,
  },
  {
    id: 'manifesto_stat_3_label',
    section: 'Ethos / Practice — stats',
    label: 'Stat 3 — label',
    usedIn: 'Label under the third stat',
    defaultValue: 'Professionals',
    multiline: false,
  },
  {
    id: 'manifesto_stat_4_value',
    section: 'Ethos / Practice — stats',
    label: 'Stat 4 — number',
    usedIn: 'Fourth stat value',
    defaultValue: '3',
    multiline: false,
  },
  {
    id: 'manifesto_stat_4_suffix',
    section: 'Ethos / Practice — stats',
    label: 'Stat 4 — suffix',
    usedIn: 'Optional suffix',
    defaultValue: '',
    multiline: false,
  },
  {
    id: 'manifesto_stat_4_label',
    section: 'Ethos / Practice — stats',
    label: 'Stat 4 — label',
    usedIn: 'Label under the fourth stat',
    defaultValue: 'Regions served',
    multiline: false,
  },
  {
    id: 'manifesto_copy_2',
    section: 'Ethos / Practice',
    label: 'Closing copy',
    usedIn: 'Second text card in the Ethos bento grid',
    defaultValue:
      'Quality, innovation and professionalism guide every project — from architectural design and interiors to structural contracting and consultancy. Same trusted team, renewed identity.',
    multiline: true,
  },
  {
    id: 'manifesto_signature',
    section: 'Ethos / Practice',
    label: 'Signature line',
    usedIn: 'Sign-off at the bottom of the Ethos section',
    defaultValue: '— MAPLE INFRA & INTERIORS',
    multiline: false,
  },
  {
    id: 'closing_quote_text',
    section: 'Testimonial',
    label: 'Quote',
    usedIn: 'Client testimonial quote on the homepage',
    defaultValue:
      'They did not build us a house. They built a way of living with the light, the rain and the trees that were already here.',
    multiline: true,
  },
  {
    id: 'closing_quote_attribution',
    section: 'Testimonial',
    label: 'Attribution',
    usedIn: 'Line below the testimonial quote',
    defaultValue: 'Private residence · Malappuram, Kerala',
    multiline: false,
  },
];

export const HOMEPAGE_CONTENT_KEYS = HOMEPAGE_CONTENT_FIELDS.map((field) => field.id);

export function getDefaultHomepageContent() {
  const defaults = {};
  for (const field of HOMEPAGE_CONTENT_FIELDS) {
    defaults[field.id] = field.defaultValue;
  }
  return defaults;
}

export function groupHomepageContentFields() {
  const groups = [];
  for (const field of HOMEPAGE_CONTENT_FIELDS) {
    let group = groups.find((entry) => entry.section === field.section);
    if (!group) {
      group = { section: field.section, fields: [] };
      groups.push(group);
    }
    group.fields.push(field);
  }
  return groups;
}

export function buildManifestoStats(content) {
  return [1, 2, 3, 4].map((index) => ({
    value: parseFloat(content[`manifesto_stat_${index}_value`] || '0') || 0,
    suffix: content[`manifesto_stat_${index}_suffix`] || '',
    label: content[`manifesto_stat_${index}_label`] || '',
  }));
}

export function parseHomepageContent(raw = {}) {
  const merged = { ...getDefaultHomepageContent(), ...raw };
  return {
    manifesto: {
      eyebrow: merged.manifesto_eyebrow,
      index: merged.manifesto_index,
      statement: merged.manifesto_statement,
      copy1: merged.manifesto_copy_1,
      copy2: merged.manifesto_copy_2,
      signature: merged.manifesto_signature,
      stats: buildManifestoStats(merged),
    },
    testimonial: {
      quote: merged.closing_quote_text,
      attribution: merged.closing_quote_attribution,
    },
    raw: merged,
  };
}
