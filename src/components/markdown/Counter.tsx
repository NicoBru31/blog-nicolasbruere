import { useState } from 'react'

/** Demo embed: `<!-- ::counter start="3" -->` in a post. */
export function Counter({ start = '0' }: { start?: string }) {
  const [count, setCount] = useState(Number(start))

  return (
    <div className="not-prose my-7 flex items-center gap-4 rounded-lg border border-line bg-surface px-4 py-3 font-mono text-sm">
      <span className="text-faint">demo://counter</span>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="ml-auto rounded border border-line px-3 py-1 text-ink transition-colors hover:border-accent hover:text-accent"
      >
        +1
      </button>
      <output aria-live="polite" className="min-w-6 text-right text-heading">
        {count}
      </output>
    </div>
  )
}
