import type { Locale } from './i18n'

// Career shown as a `git log --graph` on /about. Newest first; `lane: 1` is a side branch
// forked from main (rendered with a fork curve back into lane 0).

type Localized<T> = Record<Locale, T>

type CommitSource = {
  hash: string
  lane: 0 | 1
  /** Branch label shown like `(HEAD -> main)`. */
  ref?: string
  period: Localized<string>
  role: Localized<string>
  company: string
  /** Shown after the company, e.g. a city or "iOS & Android app". */
  place?: Localized<string>
  url?: string
  /** Key of a --tag-<name> color token, used for the commit dot. */
  color: string
  stack: string[]
  details: Localized<string[]>
}

export type Commit = Omit<CommitSource, 'period' | 'role' | 'place' | 'details'> & {
  period: string
  role: string
  place?: string
  details: string[]
}

const same = (value: string): Localized<string> => ({ en: value, fr: value })

const CAREER: CommitSource[] = [
  {
    hash: 'a1f3c2e',
    lane: 0,
    ref: 'HEAD -> main',
    period: { en: '2021 → now', fr: '2021 → aujourd’hui' },
    role: same('Lead React / TypeScript'),
    company: 'Braincube',
    place: same('Issoire'),
    color: 'react',
    stack: ['React', 'TypeScript', 'DuckDB', 'ECharts', 'Vite', 'Playwright'],
    details: {
      en: [
        'Technical lead of the squad building customer-facing data visualisation, from the React client down to the query layer.',
        'Architectural calls made with the team: DuckDB for in-browser analytics, ECharts for rendering.',
        'Company frontend standards (TypeScript, Vite, Biome, Playwright), vertical slices, shared internal libraries.',
        'Mentoring and developer experience: shorter feedback loops, less ceremony.',
      ],
      fr: [
        'Lead technique de l’équipe qui construit la dataviz client, du front React jusqu’à la couche de requêtes.',
        'Choix d’architecture portés avec l’équipe : DuckDB pour l’analytique dans le navigateur, ECharts pour le rendu.',
        'Standards front de l’entreprise (TypeScript, Vite, Biome, Playwright), slices verticales, librairies internes partagées.',
        'Mentorat et expérience développeur : boucles de feedback plus courtes, moins de cérémonie.',
      ],
    },
  },
  {
    hash: '9c04e1b',
    lane: 1,
    ref: 'side/glossema',
    period: { en: 'side project', fr: 'projet perso' },
    role: same('Glossema'),
    company: 'glossema.ai',
    place: { en: 'iOS & Android app', fr: 'app iOS & Android' },
    url: 'https://glossema.ai',
    color: 'expo',
    stack: ['React Native', 'TypeScript', 'PostgreSQL', 'Supabase'],
    details: {
      en: [
        'A dictionary for readers: point the camera at a word on a printed page and get a definition written for the sentence it appears in.',
        'Designed, built, shipped and operated alone, on the App Store and Google Play.',
      ],
      fr: [
        'Un dictionnaire pour les lecteurs : on vise un mot sur une page imprimée, on obtient une définition écrite pour la phrase où il apparaît.',
        'Conçue, développée, publiée et opérée seul, sur l’App Store et Google Play.',
      ],
    },
  },
  {
    hash: '7be20d4',
    lane: 0,
    period: same('2018 → 2021'),
    role: same('Lead developer'),
    company: 'Le Bon Gustave',
    place: same('Lyon'),
    color: 'ci-cd',
    stack: ['React', 'Node.js', 'GraphQL', 'MySQL', 'AWS'],
    details: {
      en: [
        'Sole engineer on an early-stage startup’s whole stack: React frontend, mobile app, API, database, infrastructure.',
        'API built in REST, then migrated to GraphQL as the product’s read patterns grew.',
        'Deployments and operations on AWS, on-call included.',
      ],
      fr: [
        'Seul sur toute la stack d’une startup early-stage : front React, app mobile, API, base de données, infra.',
        'API en REST, puis migration vers GraphQL quand les besoins de lecture du produit ont grandi.',
        'Déploiements et exploitation sur AWS, astreinte comprise.',
      ],
    },
  },
  {
    hash: '3e91a0f',
    lane: 0,
    period: same('2014 → 2018'),
    role: { en: 'R&D software engineer', fr: 'Ingénieur R&D' },
    company: 'CogniK',
    place: same('Écully'),
    color: 'rust',
    stack: ['C++', 'React', 'MongoDB', 'AWS'],
    details: {
      en: [
        'Built and optimised a C++ recommendation engine, where latency was the product.',
        'Client-facing web interface in React: the start of the frontend half of my career.',
      ],
      fr: [
        'Développement et optimisation d’un moteur de recommandation en C++, où la latence était le produit.',
        'Interface web client en React : le début de la moitié front de mon parcours.',
      ],
    },
  },
  {
    hash: '0d2b7c1',
    lane: 0,
    ref: 'init',
    period: same('2010 → 2014'),
    role: {
      en: 'Engineering degree, telecommunications',
      fr: 'Diplôme d’ingénieur, télécommunications',
    },
    company: 'Télécom Bretagne',
    place: same('Brest'),
    color: 'tooling',
    stack: [],
    details: { en: [], fr: [] },
  },
]

export function careerIn(locale: Locale): Commit[] {
  return CAREER.map((commit) => ({
    ...commit,
    period: commit.period[locale],
    role: commit.role[locale],
    place: commit.place?.[locale],
    details: commit.details[locale],
  }))
}

export const LINKS = [
  { label: 'github', href: 'https://github.com/NicoBru31', handle: 'NicoBru31' },
  { label: 'x', href: 'https://x.com/Nicobru7', handle: '@Nicobru7' },
] as const
