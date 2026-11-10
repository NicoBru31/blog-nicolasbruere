// Career shown as a `git log --graph` on /about. Newest first; `lane: 1` is a side branch
// forked from main (rendered with a fork curve back into lane 0).

export type Commit = {
  hash: string
  lane: 0 | 1
  /** Branch label shown like `(HEAD -> main)`. */
  ref?: string
  period: string
  role: string
  company: string
  place?: string
  url?: string
  /** Key of a --tag-<name> color token, used for the commit dot. */
  color: string
  stack: string[]
  details: string[]
}

export const CAREER: Commit[] = [
  {
    hash: 'a1f3c2e',
    lane: 0,
    ref: 'HEAD -> main',
    period: '2021 → aujourd’hui',
    role: 'Lead React / TypeScript',
    company: 'Braincube',
    place: 'Issoire',
    color: 'react',
    stack: ['React', 'TypeScript', 'DuckDB', 'ECharts', 'Vite', 'Playwright'],
    details: [
      'Lead technique de l’équipe qui construit la dataviz client, du front React jusqu’à la couche de requêtes.',
      'Choix d’architecture portés avec l’équipe : DuckDB pour l’analytique dans le navigateur, ECharts pour le rendu.',
      'Standards front de l’entreprise (TypeScript, Vite, Biome, Playwright), slices verticales, librairies internes partagées.',
      'Mentorat et expérience développeur : boucles de feedback plus courtes, moins de cérémonie.',
    ],
  },
  {
    hash: '9c04e1b',
    lane: 1,
    ref: 'side/glossema',
    period: 'projet perso',
    role: 'Glossema',
    company: 'app iOS & Android',
    url: 'https://glossema.ai',
    color: 'expo',
    stack: ['React Native', 'TypeScript', 'PostgreSQL', 'Supabase'],
    details: [
      'Un dictionnaire pour les lecteurs : on vise un mot sur une page imprimée, on obtient une définition écrite pour la phrase où il apparaît.',
      'Conçue, développée, publiée et opérée seul, sur l’App Store et Google Play.',
    ],
  },
  {
    hash: '7be20d4',
    lane: 0,
    period: '2018 → 2021',
    role: 'Lead developer',
    company: 'Le Bon Gustave',
    place: 'Lyon',
    color: 'ci-cd',
    stack: ['React', 'Node.js', 'GraphQL', 'MySQL', 'AWS'],
    details: [
      'Seul sur toute la stack d’une startup early-stage : front React, app mobile, API, base de données, infra.',
      'API en REST, puis migration vers GraphQL quand les besoins de lecture du produit ont grandi.',
      'Déploiements et exploitation sur AWS, astreinte comprise.',
    ],
  },
  {
    hash: '3e91a0f',
    lane: 0,
    period: '2014 → 2018',
    role: 'Ingénieur R&D',
    company: 'CogniK',
    place: 'Écully',
    color: 'rust',
    stack: ['C++', 'React', 'MongoDB', 'AWS'],
    details: [
      'Développement et optimisation d’un moteur de recommandation en C++, où la latence était le produit.',
      'Interface web client en React : le début de la moitié front de mon parcours.',
    ],
  },
  {
    hash: '0d2b7c1',
    lane: 0,
    ref: 'init',
    period: '2010 → 2014',
    role: 'Diplôme d’ingénieur, télécommunications',
    company: 'Télécom Bretagne',
    place: 'Brest',
    color: 'tooling',
    stack: [],
    details: [],
  },
]

export const LINKS = [
  { label: 'github', href: 'https://github.com/NicoBru31', handle: 'NicoBru31' },
  { label: 'x', href: 'https://x.com/Nicobru7', handle: '@Nicobru7' },
] as const
