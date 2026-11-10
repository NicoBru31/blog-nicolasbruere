import { Link } from '@tanstack/react-router'
import { useI18n } from '#/lib/i18n'

/** Techno chip; colors come from the --tag-<name> tokens in styles.css. */
export function Tag({ name }: { name: string }) {
  const { param } = useI18n()
  return (
    <Link
      to="/{-$locale}/tags/$tag"
      params={{ locale: param, tag: name }}
      className="rounded px-1.75 py-0.5 font-mono text-[11px] leading-5 hover:underline"
      style={{
        background: `var(--tag-${name}, var(--line))`,
        color: `var(--tag-${name}-ink, var(--ink))`,
      }}
    >
      {name}
    </Link>
  )
}
