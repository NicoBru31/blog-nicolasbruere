import { createFileRoute } from '@tanstack/react-router'
import { isoDay, PostList } from '#/components/PostList'
import { listPosts } from '#/lib/content'
import { MESSAGES, toLocale, useI18n } from '#/lib/i18n'
import { ldScript, websiteLd } from '#/lib/seo'
import { SITE } from '#/lib/site'

export const Route = createFileRoute('/{-$locale}/')({
  loader: ({ params }) => listPosts({ data: params.locale }),
  head: ({ params }) => {
    const locale = toLocale(params.locale)
    const t = MESSAGES[locale]
    return {
      meta: [
        { name: 'description', content: t.siteDescription },
        { property: 'og:title', content: `${SITE.title} — ${t.home.title}` },
        { property: 'og:description', content: t.siteDescription },
      ],
      scripts: [ldScript(websiteLd(locale, t.siteDescription))],
    }
  },
  component: Home,
})

function Home() {
  const posts = Route.useLoaderData()
  const { t } = useI18n()
  const latest = posts[0]

  return (
    <>
      <section className="mb-10">
        <h1 className="text-2xl font-medium tracking-tight text-heading sm:text-[28px]">
          {t.home.title}
        </h1>
        <p className="mt-2 font-mono text-xs text-faint">
          // {t.home.count(posts.length)}
          {latest && ` · ${t.home.latest(isoDay(latest.pubDate))}`}
        </p>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">{t.home.intro}</p>
      </section>
      <PostList posts={posts} />
    </>
  )
}
