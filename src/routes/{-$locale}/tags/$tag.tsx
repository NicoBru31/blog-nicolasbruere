import { createFileRoute } from '@tanstack/react-router'
import { PostList } from '#/components/PostList'
import { listPosts } from '#/lib/content'
import { useI18n } from '#/lib/i18n'
import { SITE } from '#/lib/site'

export const Route = createFileRoute('/{-$locale}/tags/$tag')({
  loader: async ({ params }) => {
    const posts = await listPosts({ data: params.locale })
    return posts.filter((post) => (post.tags as readonly string[]).includes(params.tag))
  },
  head: ({ params }) => ({ meta: [{ title: `#${params.tag} — ${SITE.title}` }] }),
  component: TagPage,
})

function TagPage() {
  const posts = Route.useLoaderData()
  const { tag } = Route.useParams()
  const { t } = useI18n()

  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight text-heading">
        <span style={{ color: `var(--tag-${tag}-ink, var(--accent))` }}>#</span>
        {tag}
      </h1>
      <p className="mt-2 mb-10 font-mono text-xs text-faint">// {t.tags.count(posts.length)}</p>
      <PostList posts={posts} />
    </>
  )
}
