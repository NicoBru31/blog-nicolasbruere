import { createFileRoute } from '@tanstack/react-router'
import { ReadingList } from '#/components/ReadingList'
import { listReadings } from '#/lib/content'
import { MESSAGES, toLocale, useI18n } from '#/lib/i18n'
import { SITE } from '#/lib/site'

export const Route = createFileRoute('/{-$locale}/readings/')({
  loader: ({ params }) => listReadings({ data: params.locale }),
  head: ({ params }) => {
    const t = MESSAGES[toLocale(params.locale)]
    return {
      meta: [
        { title: `${t.readings.title} — ${SITE.title}` },
        { name: 'description', content: t.readings.description },
      ],
    }
  },
  component: ReadingsPage,
})

function ReadingsPage() {
  const { current, finished } = Route.useLoaderData()
  const { t } = useI18n()

  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight text-heading sm:text-[28px]">
        {t.readings.title}
      </h1>
      <p className="mt-2 mb-10 font-mono text-xs text-faint">{t.readings.subtitle}</p>

      {current.length === 0 && finished.length === 0 && (
        <p className="font-mono text-sm text-faint">{t.readings.empty}</p>
      )}

      {current.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-3 font-mono text-sm text-muted">{t.readings.current}</h2>
          <ReadingList readings={current} />
        </section>
      )}

      {finished.length > 0 && (
        <section>
          <h2 className="mb-3 font-mono text-sm text-muted">{t.readings.finished}</h2>
          <ReadingList readings={finished} />
        </section>
      )}
    </>
  )
}
