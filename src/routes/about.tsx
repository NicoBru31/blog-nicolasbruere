import { createFileRoute, Link } from '@tanstack/react-router'
import { GitGraph } from '#/components/GitGraph'
import { CAREER, LINKS } from '#/lib/about'
import { SITE } from '#/lib/site'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: `À propos — ${SITE.title}` },
      {
        name: 'description',
        content: 'Tech lead React/TypeScript en Auvergne : parcours, projets et vie hors du code.',
      },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <>
      <section className="mb-14">
        <h1 className="text-2xl font-medium tracking-tight text-heading sm:text-[28px]">
          Nicolas Bruère
        </h1>
        <p className="mt-2 font-mono text-xs text-faint">
          // tech lead react/typescript · auvergne
        </p>
        <div className="mt-5 max-w-2xl space-y-3 leading-relaxed text-muted">
          <p>
            Tech lead React/TypeScript chez Braincube. Douze ans à livrer des produits web et
            mobiles de bout en bout, d’un moteur de recommandation en C++ jusqu’au rendu de dataviz
            industrielles.
          </p>
          <p>Ici, je note ce que j’apprends en construisant : React, Rust, Java, CI/CD et Expo.</p>
        </div>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="text-muted transition-colors hover:text-accent">
                <span className="text-faint">{link.label}/</span>
                {link.handle}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14">
        <h2 className="mb-1 text-lg font-medium text-heading">Parcours</h2>
        <p className="mb-6 font-mono text-xs text-faint">$ git log --graph --all</p>
        <GitGraph commits={CAREER} />
      </section>

      <section>
        <h2 className="mb-1 text-lg font-medium text-heading">Hors du code</h2>
        <p className="mb-6 font-mono text-xs text-faint">// mes sources de bonheur au quotidien</p>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-[110px_minmax(0,1fr)]">
          <Hobby term="famille">Papa de trois enfants.</Hobby>
          <Hobby term="lecture">
            Je lis beaucoup, de Balzac à Jaworski.{' '}
            <Link to="/lectures" className="text-accent underline-offset-3 hover:underline">
              Mes lectures
            </Link>
            .
          </Hobby>
          <Hobby term="rugby">
            Deuxième ligne, et supporter du <span className="text-heading">Stade Toulousain</span>.
          </Hobby>
          <Hobby term="basket">Aussi, pour changer de ballon.</Hobby>
        </dl>
      </section>
    </>
  )
}

function Hobby({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="font-mono text-sm text-faint">{term}</dt>
      <dd className="text-muted">{children}</dd>
    </>
  )
}
