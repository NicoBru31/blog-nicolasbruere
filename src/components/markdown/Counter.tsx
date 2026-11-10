import { useState } from 'react'

/** Demo embed: `<!-- ::counter start="3" -->` in a post. */
export function Counter({ start = '0' }: { start?: string }) {
  const [count, setCount] = useState(Number(start))

  return (
    <div className="not-prose my-6 flex items-center gap-4 rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded bg-zinc-900 px-3 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        +1
      </button>
      <output aria-live="polite">{count}</output>
    </div>
  )
}
