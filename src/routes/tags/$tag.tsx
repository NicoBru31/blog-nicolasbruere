import { createFileRoute } from '@tanstack/react-router'
import { PostList } from '#/components/PostList'
import { listPosts } from '#/lib/content'
import { SITE } from '#/lib/site'

export const Route = createFileRoute('/tags/$tag')({
  loader: async ({ params }) => {
    const posts = await listPosts()
    return posts.filter((post) => (post.tags as readonly string[]).includes(params.tag))
  },
  head: ({ params }) => ({ meta: [{ title: `#${params.tag} — ${SITE.title}` }] }),
  component: TagPage,
})

function TagPage() {
  const posts = Route.useLoaderData()
  const { tag } = Route.useParams()

  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight text-heading">
        <span style={{ color: `var(--tag-${tag}-ink, var(--accent))` }}>#</span>
        {tag}
      </h1>
      <p className="mt-2 mb-10 font-mono text-xs text-faint">
        // {posts.length} article{posts.length > 1 ? 's' : ''}
      </p>
      <PostList posts={posts} />
    </>
  )
}
