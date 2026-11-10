import { createFileRoute, Link } from '@tanstack/react-router'
import { Article } from '#/components/markdown/Article'
import { isoDay } from '#/components/PostList'
import { Tag } from '#/components/Tag'
import { getPost } from '#/lib/content'
import { SITE } from '#/lib/site'

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
          { property: 'article:published_time', content: isoDay(post.pubDate) },
        ]
      : [],
  }),
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()

  return (
    <article>
      <Link to="/" className="font-mono text-xs text-faint transition-colors hover:text-accent">
        ← cd ..
      </Link>
      <header className="mt-6 mb-10 border-b border-line pb-8">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Tag key={tag} name={tag} />
          ))}
        </div>
        <h1 className="text-3xl leading-tight font-medium tracking-tight text-heading sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">{post.description}</p>
        <p className="mt-4 font-mono text-xs text-faint">
          <time dateTime={isoDay(post.pubDate)}>{isoDay(post.pubDate)}</time> · {post.readingTime}{' '}
          min de lecture
        </p>
      </header>
      <Article document={post.document} />
    </article>
  )
}
