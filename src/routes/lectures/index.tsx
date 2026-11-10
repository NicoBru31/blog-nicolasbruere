import { createFileRoute } from '@tanstack/react-router'
import { ReadingList } from '#/components/ReadingList'
import { listReadings } from '#/lib/content'
import { SITE } from '#/lib/site'

export const Route = createFileRoute('/lectures/')({
  loader: () => listReadings(),
  head: () => ({
    meta: [
      { title: `Lectures — ${SITE.title}` },
      { name: 'description', content: 'Ce que je lis, de Balzac à Jaworski.' },
    ],
  }),
  component: ReadingsPage,
})

function ReadingsPage() {
  const { current, finished } = Route.useLoaderData()

  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight text-heading sm:text-[28px]">Lectures</h1>
      <p className="mt-2 mb-10 font-mono text-xs text-faint">// de balzac à jaworski</p>

      {current.length === 0 && finished.length === 0 && (
        <p className="font-mono text-sm text-faint">// aucune fiche de lecture pour l'instant</p>
      )}

      {current.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-3 font-mono text-sm text-muted">en cours</h2>
          <ReadingList readings={current} />
        </section>
      )}

      {finished.length > 0 && (
        <section>
          <h2 className="mb-3 font-mono text-sm text-muted">lues</h2>
          <ReadingList readings={finished} />
        </section>
      )}
    </>
  )
}
