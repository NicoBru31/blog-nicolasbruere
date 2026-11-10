import { describe, expect, test } from 'bun:test'
import { isLocaleParam, localeParam, localizedPath, MESSAGES, toLocale } from './i18n'

describe('locale params', () => {
  test('no prefix is English, /fr is French', () => {
    expect(toLocale(undefined)).toBe('en')
    expect(toLocale('fr')).toBe('fr')
    expect(localeParam('en')).toBeUndefined()
    expect(localeParam('fr')).toBe('fr')
  })

  test('only "fr" is a valid prefix: /en/... and others are not', () => {
    expect(isLocaleParam(undefined)).toBe(true)
    expect(isLocaleParam('fr')).toBe(true)
    expect(isLocaleParam('en')).toBe(false)
    expect(isLocaleParam('de')).toBe(false)
  })
})

describe('localizedPath', () => {
  test('adds or strips the /fr prefix', () => {
    expect(localizedPath('/about', 'fr')).toBe('/fr/about')
    expect(localizedPath('/fr/about', 'en')).toBe('/about')
    expect(localizedPath('/', 'fr')).toBe('/fr')
    expect(localizedPath('/fr', 'en')).toBe('/')
    expect(localizedPath('/fr/posts/hello-world', 'fr')).toBe('/fr/posts/hello-world')
  })

  test('does not mistake a path starting with "fr" for the prefix', () => {
    expect(localizedPath('/frameworks', 'en')).toBe('/frameworks')
  })
})

describe('messages', () => {
  // Every key in one language exists in the other: a missing string fails here, not in prod.
  const keys = (value: unknown, prefix = ''): string[] =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? Object.entries(value).flatMap(([key, child]) => keys(child, `${prefix}${key}.`))
      : [prefix.slice(0, -1)]

  test('en and fr have the same keys', () => {
    expect(keys(MESSAGES.fr).toSorted()).toEqual(keys(MESSAGES.en).toSorted())
  })
})
