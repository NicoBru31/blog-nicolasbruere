import { createFileRoute } from '@tanstack/react-router'
import { isoDay, PostList } from '#/components/PostList'
import { listPosts } from '#/lib/content'

export const Route = createFileRoute('/')({
  loader: () => listPosts(),
  component: Home,
})

function Home() {
  const posts = Route.useLoaderData()
  const latest = posts[0]

  return (
    <>
      <section className="mb-10">
        <h1 className="text-2xl font-medium tracking-tight text-heading sm:text-[28px]">
          Carnet de bord d'un dev full stack
        </h1>
        <p className="mt-2 font-mono text-xs text-faint">
          // {posts.length} article{posts.length > 1 ? 's' : ''}
          {latest && ` · dernier le ${isoDay(latest.pubDate)}`}
        </p>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          React, Rust, Java, CI/CD et Expo : ce que j'apprends en construisant, noté au propre.
        </p>
      </section>
      <PostList posts={posts} />
    </>
  )
}
