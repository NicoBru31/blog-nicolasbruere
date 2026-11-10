import { createFileRoute, Link } from '@tanstack/react-router'
import { Article } from '#/components/markdown/Article'
import { getPost } from '#/lib/content'
import { SITE } from '#/lib/site'

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })

export const Route = createFileRoute('/posts/$slug')({
  loader: ({ params }) => getPost({ data: params.slug }),
  head: ({ loaderData: post }) => ({
    meta: post
      ? [
          { title: `${post.title} — ${SITE.title}` },
          { name: 'description', content: post.description },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: post.title },
          { property: 'og:description', content: post.description },
          { property: 'article:published_time', content: new Date(post.pubDate).toISOString() },
        ]
      : [],
  }),
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()

  return (
    <article>
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-3 flex flex-wrap gap-x-3 text-sm text-zinc-500">
          <time dateTime={new Date(post.pubDate).toISOString()}>
            {dateFormat.format(new Date(post.pubDate))}
          </time>
          <span>{post.readingTime} min de lecture</span>
          {post.tags.map((tag) => (
            <Link key={tag} to="/tags/$tag" params={{ tag }} className="hover:underline">
              #{tag}
            </Link>
          ))}
        </p>
      </header>
      <Article document={post.document} />
    </article>
  )
}
