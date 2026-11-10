import { Link } from '@tanstack/react-router'
import { LOCALES, localeParam, useI18n } from '#/lib/i18n'

/** `[en · fr]`: the same page in the other language (keeps the current route and params). */
export function LanguageSwitch() {
  const { locale, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t.languageGroup}
      className="flex items-center font-mono text-faint"
    >
      <span aria-hidden="true">[</span>
      {LOCALES.map((target, index) => (
        <span key={target} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="px-1">
              ·
            </span>
          )}
          <Link
            to="."
            params={(prev: Record<string, string | undefined>) => ({
              ...prev,
              locale: localeParam(target),
            })}
            hrefLang={target}
            lang={target}
            aria-current={target === locale ? 'true' : undefined}
            className={
              target === locale ? 'text-accent' : 'text-muted transition-colors hover:text-ink'
            }
          >
            {target}
          </Link>
        </span>
      ))}
      <span aria-hidden="true">]</span>
    </div>
  )
}
