import { Link } from '@tanstack/react-router'
import { useI18n } from '#/lib/i18n'
import { titleTransition } from '#/lib/transitions'
import { Tag } from './Tag'

type PostSummary = {
  slug: string
  title: string
  description: string
  pubDate: Date
  readingTime: number
  tags: readonly string[]
}

/** ISO day (2026-11-10): reads well in mono and never depends on the viewer's locale. */
export const isoDay = (date: Date) => new Date(date).toISOString().slice(0, 10)

export function PostList({ posts }: { posts: PostSummary[] }) {
  const { t, param } = useI18n()

  if (posts.length === 0) {
    return <p className="font-mono text-sm text-faint">{t.home.empty}</p>
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {posts.map((post) => (
        <li
          key={post.slug}
          className="group relative flex flex-col rounded-lg border border-line bg-surface p-4 transition-colors hover:border-accent"
        >
          <div className="relative z-10 mb-2.5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>
          <h2
            className="w-fit text-base leading-snug font-medium text-heading"
            style={titleTransition('post', post.slug)}
          >
            {/* Stretched link: the whole card is clickable, tags stay separate links. */}
            <Link
              to="/{-$locale}/posts/$slug"
              params={{ locale: param, slug: post.slug }}
              className="after:absolute after:inset-0 after:rounded-lg"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{post.description}</p>
          <p className="mt-auto pt-3 font-mono text-[11px] text-faint">
            <time dateTime={isoDay(post.pubDate)}>{isoDay(post.pubDate)}</time> ·{' '}
            {t.post.minutes(post.readingTime)}
          </p>
        </li>
      ))}
    </ul>
  )
}
