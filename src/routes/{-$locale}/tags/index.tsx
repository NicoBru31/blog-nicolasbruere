import { createFileRoute, Link } from '@tanstack/react-router'
import { listPosts } from '#/lib/content'
import { MESSAGES, toLocale, useI18n } from '#/lib/i18n'
import { groupByTag } from '#/lib/posts'
import { SITE } from '#/lib/site'

export const Route = createFileRoute('/{-$locale}/tags/')({
  loader: async ({ params }) => {
    const posts = await listPosts({ data: params.locale })
    return [...groupByTag(posts)]
      .map(([tag, tagged]) => ({ tag, count: tagged.length }))
      .toSorted((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  },
  head: ({ params }) => ({
    meta: [{ title: `${MESSAGES[toLocale(params.locale)].tags.title} — ${SITE.title}` }],
  }),
  component: TagsPage,
})

function TagsPage() {
  const tags = Route.useLoaderData()
  const { t, param } = useI18n()

  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight text-heading">{t.tags.title}</h1>
      <p className="mt-2 mb-10 font-mono text-xs text-faint">{t.tags.subtitle}</p>
      <ul className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <Link
              to="/{-$locale}/tags/$tag"
              params={{ locale: param, tag }}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-sm hover:underline"
              style={{ background: `var(--tag-${tag})`, color: `var(--tag-${tag}-ink)` }}
            >
              {tag}
              <span className="opacity-70">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
