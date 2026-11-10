import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { isLocaleParam } from '#/lib/i18n'

// Only `/…` (English) and `/fr/…` (French) exist: `/en/…` or any other prefix is a 404 rather
// than a duplicate of an English page.
export const Route = createFileRoute('/{-$locale}')({
  beforeLoad: ({ params }) => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router idiom
    if (!isLocaleParam(params.locale)) throw notFound()
  },
  component: Outlet,
})
