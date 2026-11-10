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
      <h1 className="mb-10 text-3xl font-bold">#{tag}</h1>
      <PostList posts={posts} />
    </>
  )
}
