export const SECTION_DEFS = [
  {
    id: 'about',
    title: 'ABOUT',
    subtitle: 'Identity and Research Focus',
    pos: [-18, 5, -55],
    eyebrow: 'Identity',
    body:
      'I work on configuration security and software security, with a focus on understanding how real-world software misconfigurations arise, how they can be diagnosed, and how configuration-related risks can be reduced in practice.',
    cta: [{ label: 'GitHub', href: 'https://github.com/anabioticsoul' }],
    type: 'planet',
    color: '#6ea8ff',
    collisionRadius: 3.6,
  },
  {
    id: 'projects',
    title: 'PROJECTS',
    subtitle: 'Repos of Research and Prototypes',
    pos: [18, -2, -92],
    eyebrow: 'Repos',
    body: '',
    cta: [
      { label: 'misconfiguration_datasets', href: 'https://github.com/anabioticsoul/misconfiguration_datasets' },
      { label: 'BJTU-thesis-template', href: 'https://github.com/anabioticsoul/BJTU-thesis-template' },
      { label: 'CRSExtractor', href: 'https://github.com/anabioticsoul/CRSExtractor' },
    ],
    type: 'ringed',
    color: '#9f8cff',
    collisionRadius: 5.2,
  },
  {
    id: 'publications',
    title: 'PUBLICATIONS',
    subtitle: 'Papers',
    pos: [-14, 8, -132],
    eyebrow: 'Research',
    body: '',
    cta: [
      {
        label: 'Rethinking software misconfigurations in the real world: an empirical study and literature analysis',
        href: 'https://arxiv.org/abs/2412.11121',
      },
      {
        label: 'CRSExtractor: Automated configuration option read sites extraction towards IoT cloud infrastructure',
        href: 'https://www.cell.com/heliyon/fulltext/S2405-8440(23)02560-4',
      },
    ],
    type: 'binary',
    color: '#85d7ff',
    collisionRadius: 4,
  },
  {
    id: 'contact',
    title: 'CONTACT',
    subtitle: 'Social links',
    pos: [15, 10, -172],
    eyebrow: 'Connect',
    body:
      'Feel free to reach out for research collaboration, datasets, or discussion on configuration security and software misconfigurations.',
    cta: [
      { label: 'Email', href: 'mailto:anabioticsoul@gmail.com' },
      { label: 'X' },
      { label: 'Instagram' },
    ],
    type: 'station',
    color: '#ffd36e',
    collisionRadius: 3.2,
  },
]
