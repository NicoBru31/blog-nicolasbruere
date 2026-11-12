import { createFileRoute, Link } from '@tanstack/react-router'
import { Article } from '#/components/markdown/Article'
import { isoDay } from '#/components/PostList'
import { Tag } from '#/components/Tag'
import { getPost } from '#/lib/content'
import { localizedPath, toLocale, useI18n } from '#/lib/i18n'
import { blogPostingLd, ldScript } from '#/lib/seo'
import { absoluteUrl, SITE } from '#/lib/site'

export const Route = createFileRoute('/{-$locale}/posts/$slug')({
  loader: ({ params }) => getPost({ data: { slug: params.slug, locale: params.locale } }),
  head: ({ loaderData: post, params }) =>
    post
      ? {
          meta: [
            { title: `${post.title} — ${SITE.title}` },
            { name: 'description', content: post.description },
            { name: 'author', content: SITE.author.name },
            { property: 'og:type', content: 'article' },
            { property: 'og:title', content: post.title },
            { property: 'og:description', content: post.description },
            { property: 'article:published_time', content: isoDay(post.pubDate) },
            {
              property: 'article:modified_time',
              content: isoDay(post.updatedDate ?? post.pubDate),
            },
            {
              property: 'article:author',
              content: absoluteUrl(localizedPath('/about', toLocale(params.locale))),
            },
            ...post.tags.map((tag) => ({ property: 'article:tag', content: tag })),
            { name: 'twitter:title', content: post.title },
            { name: 'twitter:description', content: post.description },
          ],
          scripts: [ldScript(blogPostingLd(post, toLocale(params.locale)))],
        }
      : {},
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()
  const { t, param } = useI18n()

  return (
    <article>
      <Link
        to="/{-$locale}"
        params={{ locale: param }}
        className="font-mono text-xs text-faint transition-colors hover:text-accent"
      >
        {t.post.back}
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
          <time dateTime={isoDay(post.pubDate)}>{isoDay(post.pubDate)}</time> ·{' '}
          {t.post.readTime(post.readingTime)}
        </p>
      </header>
      <Article document={post.document} />
    </article>
  )
}
