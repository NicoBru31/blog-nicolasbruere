import { useParams } from '@tanstack/react-router'

// English at the root (`/about`), French under `/fr/` (`/fr/about`): one route tree with an
// optional `{-$locale}` segment, no duplicated routes.

export const LOCALES = ['en', 'fr'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

/** The `{-$locale}` param value: undefined means the default locale. */
export const toLocale = (param?: string): Locale => (param === 'fr' ? 'fr' : 'en')
/** Back to a param value for links: the default locale has no prefix. */
export const localeParam = (locale: Locale) => (locale === DEFAULT_LOCALE ? undefined : locale)
export const isLocaleParam = (param?: string) => param === undefined || param === 'fr'

/** Path of the same page in another locale: `/fr/about` ↔ `/about`. */
export function localizedPath(pathname: string, locale: Locale): string {
  const bare = pathname.replace(/^\/fr(?=\/|$)/, '') || '/'
  return locale === DEFAULT_LOCALE ? bare : `/fr${bare === '/' ? '' : bare}`
}

const en = {
  htmlLang: 'en',
  siteDescription: 'Dev blog: React, Rust, Java, CI/CD and Expo.',
  nav: { articles: '/articles', readings: '/readings', tags: '/tags', about: '/about' },
  theme: {
    group: 'Theme',
    options: { auto: 'auto', light: 'light', dark: 'dark' },
    titles: { auto: 'Follow the system theme', light: 'Light theme', dark: 'Dark theme' },
  },
  languageGroup: 'Language',
  readingNow: 'reading now:',
  footerStack: '// TanStack Start · Redact · Bun',
  notFound: { code: '// 404', title: 'Page not found', back: 'cd ~/articles' },
  home: {
    title: 'Logbook of a full stack dev',
    count: (n: number) => `${n} post${n > 1 ? 's' : ''}`,
    latest: (day: string) => `latest on ${day}`,
    intro: 'React, Rust, Java, CI/CD and Expo: what I learn while building, written down properly.',
    empty: '// no posts yet',
  },
  post: {
    back: '← cd ..',
    minutes: (n: number) => `${n} min`,
    readTime: (n: number) => `${n} min read`,
  },
  tags: {
    title: 'Tags',
    subtitle: '// one color per tech',
    count: (n: number) => `${n} post${n > 1 ? 's' : ''}`,
  },
  readings: {
    title: 'Readings',
    subtitle: '// from balzac to jaworski',
    description: 'What I read, from Balzac to Jaworski.',
    empty: '// no reading notes yet',
    current: 'reading',
    finished: 'read',
    since: (day: string) => `since ${day}`,
    finishedOn: (day: string) => `finished ${day}`,
    started: (day: string) => `started ${day}`,
    ongoing: 'in progress',
    back: '← cd ../readings',
  },
  about: {
    title: 'About',
    metaDescription:
      'React/TypeScript tech lead in Auvergne, France: career, projects and life outside code.',
    tagline: '// react/typescript tech lead · auvergne, france',
    intro: [
      'React/TypeScript tech lead at Braincube. Twelve years shipping web and mobile products end to end, from a C++ recommendation engine to the rendering of industrial data visualisation.',
      'Here I write down what I learn while building: React, Rust, Java, CI/CD and Expo.',
    ],
    career: 'Career',
    show: 'show ▸',
    outside: 'Outside code',
    outsideSubtitle: '// my everyday sources of happiness',
    family: 'Father of three.',
    reading: 'I read a lot, from Balzac to Jaworski.',
    readingLink: 'My readings',
    rugbyBefore: 'Second row, and a',
    rugbyAfter: 'supporter.',
    basket: 'Also, for a change of ball.',
    terms: { family: 'family', reading: 'reading', rugby: 'rugby', basket: 'basketball' },
  },
}

export type Messages = typeof en

const fr: Messages = {
  htmlLang: 'fr',
  siteDescription: 'Blog de dev : React, Rust, Java, CI/CD et Expo.',
  nav: { articles: '/articles', readings: '/lectures', tags: '/tags', about: '/about' },
  theme: {
    group: 'Thème',
    options: { auto: 'auto', light: 'clair', dark: 'sombre' },
    titles: { auto: 'Suivre le thème du système', light: 'Thème clair', dark: 'Thème sombre' },
  },
  languageGroup: 'Langue',
  readingNow: 'en train de lire :',
  footerStack: '// TanStack Start · Redact · Bun',
  notFound: { code: '// 404', title: 'Page introuvable', back: 'cd ~/articles' },
  home: {
    title: 'Carnet de bord d’un dev full stack',
    count: (n: number) => `${n} article${n > 1 ? 's' : ''}`,
    latest: (day: string) => `dernier le ${day}`,
    intro: 'React, Rust, Java, CI/CD et Expo : ce que j’apprends en construisant, noté au propre.',
    empty: '// aucun article pour l’instant',
  },
  post: {
    back: '← cd ..',
    minutes: (n: number) => `${n} min`,
    readTime: (n: number) => `${n} min de lecture`,
  },
  tags: {
    title: 'Tags',
    subtitle: '// une couleur par techno',
    count: (n: number) => `${n} article${n > 1 ? 's' : ''}`,
  },
  readings: {
    title: 'Lectures',
    subtitle: '// de balzac à jaworski',
    description: 'Ce que je lis, de Balzac à Jaworski.',
    empty: '// aucune fiche de lecture pour l’instant',
    current: 'en cours',
    finished: 'lues',
    since: (day: string) => `depuis le ${day}`,
    finishedOn: (day: string) => `fini le ${day}`,
    started: (day: string) => `commencé le ${day}`,
    ongoing: 'en cours',
    back: '← cd ../lectures',
  },
  about: {
    title: 'À propos',
    metaDescription:
      'Tech lead React/TypeScript en Auvergne : parcours, projets et vie hors du code.',
    tagline: '// tech lead react/typescript · auvergne',
    intro: [
      'Tech lead React/TypeScript chez Braincube. Douze ans à livrer des produits web et mobiles de bout en bout, d’un moteur de recommandation en C++ jusqu’au rendu de dataviz industrielles.',
      'Ici, je note ce que j’apprends en construisant : React, Rust, Java, CI/CD et Expo.',
    ],
    career: 'Parcours',
    show: 'show ▸',
    outside: 'Hors du code',
    outsideSubtitle: '// mes sources de bonheur au quotidien',
    family: 'Papa de trois enfants.',
    reading: 'Je lis beaucoup, de Balzac à Jaworski.',
    readingLink: 'Mes lectures',
    rugbyBefore: 'Deuxième ligne, et supporter du',
    rugbyAfter: '.',
    basket: 'Aussi, pour changer de ballon.',
    terms: { family: 'famille', reading: 'lecture', rugby: 'rugby', basket: 'basket' },
  },
}

export const MESSAGES: Record<Locale, Messages> = { en, fr }

/** Current locale (from the `{-$locale}` param), its messages and its link param. */
export function useI18n() {
  // Typed by the route tree: `locale` is the optional `{-$locale}` param, absent outside it.
  const { locale: param } = useParams({ strict: false })
  const locale = toLocale(param)
  return { locale, t: MESSAGES[locale], param: localeParam(locale) }
}
