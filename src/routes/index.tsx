import { createFileRoute } from '@tanstack/react-router'
import { PostList } from '#/components/PostList'
import { listPosts } from '#/lib/content'

export const Route = createFileRoute('/')({
  loader: () => listPosts(),
  component: Home,
})

function Home() {
  const posts = Route.useLoaderData()

  return (
    <>
      <section className="mb-12">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          React, Rust, Java, CI/CD et Expo — notes de dev.
        </p>
      </section>
      <PostList posts={posts} />
    </>
  )
}
