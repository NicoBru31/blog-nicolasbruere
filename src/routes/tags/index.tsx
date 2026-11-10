import { createFileRoute, Link } from '@tanstack/react-router'
import { listPosts } from '#/lib/content'
import { groupByTag } from '#/lib/posts'
import { SITE } from '#/lib/site'

export const Route = createFileRoute('/tags/')({
  loader: async () => {
    const posts = await listPosts()
    return [...groupByTag(posts)]
      .map(([tag, tagged]) => ({ tag, count: tagged.length }))
      .toSorted((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  },
  head: () => ({ meta: [{ title: `Tags — ${SITE.title}` }] }),
  component: TagsPage,
})

function TagsPage() {
  const tags = Route.useLoaderData()

  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight text-heading">Tags</h1>
      <p className="mt-2 mb-10 font-mono text-xs text-faint">// une couleur par techno</p>
      <ul className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <Link
              to="/tags/$tag"
              params={{ tag }}
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
