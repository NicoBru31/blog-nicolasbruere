// Structured data (JSON-LD) and Open Graph helpers. Pure: no content-collections import, so bun
// test can load them.

import { type Locale, localizedPath } from './i18n'
import { absoluteUrl, SITE } from './site'

export const OG_LOCALES: Record<Locale, string> = { en: 'en_US', fr: 'fr_FR' }

const PERSON_ID = `${SITE.url}/#person`
const WEBSITE_ID = `${SITE.url}/#website`

/** Serialized for a `<script type="application/ld+json">`: `<` escaped so content can't close it. */
export const jsonLd = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c')

export function personLd() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.author.name,
    url: absoluteUrl('/about'),
    jobTitle: SITE.author.jobTitle,
    worksFor: { '@type': 'Organization', name: SITE.author.worksFor },
    sameAs: SITE.author.sameAs,
  }
}

export function websiteLd(locale: Locale, description: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: absoluteUrl(localizedPath('/', locale)),
        name: SITE.title,
        description,
        inLanguage: locale,
        author: { '@id': PERSON_ID },
      },
      personLd(),
    ],
  }
}

export function profilePageLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl(localizedPath('/about', locale)),
    inLanguage: locale,
    mainEntity: personLd(),
  }
}

export type PostSeo = {
  slug: string
  title: string
  description: string
  pubDate: Date
  updatedDate?: Date
  tags: readonly string[]
  readingTime: number
}

export const postPath = (slug: string, locale: Locale) => localizedPath(`/posts/${slug}`, locale)

export function blogPostingLd(post: PostSeo, locale: Locale) {
  const url = absoluteUrl(postPath(post.slug, locale))
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate.toISOString(),
    dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
    inLanguage: locale,
    keywords: post.tags.join(', '),
    timeRequired: `PT${post.readingTime}M`,
    image: absoluteUrl(SITE.ogImage.path),
    author: personLd(),
    publisher: { '@id': PERSON_ID },
    isPartOf: { '@type': 'Blog', '@id': WEBSITE_ID, name: SITE.title },
  }
}

/** Head entries for one JSON-LD block. */
export const ldScript = (data: object) => ({
  type: 'application/ld+json',
  children: jsonLd(data),
})
