import type { Commit } from '#/lib/about'

// Lane centers in px inside the 48px graph column.
const LANE_X = [11, 35] as const
const DOT_TOP = 7
const FORK = 18 // height of the curve that brings lane 1 back into lane 0

const lineBase = 'absolute w-0.5 bg-line'

/**
 * A `git log --graph`-style timeline. Each row draws its own slice of the graph with absolutely
 * positioned lines, so rows can have any height (expanded details included).
 */
export function GitGraph({ commits }: { commits: Commit[] }) {
  return (
    <ol className="relative">
      {commits.map((commit, index) => {
        const first = index === 0
        const last = index === commits.length - 1
        const x = LANE_X[commit.lane]
        return (
          <li key={commit.hash} className="grid grid-cols-[48px_minmax(0,1fr)]">
            <div className="relative" aria-hidden="true">
              {/* Main lane passes through every row (starts at the first dot, ends at the last). */}
              <span
                className={lineBase}
                style={{
                  left: LANE_X[0] - 1,
                  top: first ? DOT_TOP + 6 : 0,
                  bottom: last ? `calc(100% - ${DOT_TOP + 6}px)` : 0,
                }}
              />
              {commit.lane === 1 && (
                <>
                  <span
                    className={lineBase}
                    style={{ left: x - 1, top: DOT_TOP + 6, bottom: FORK }}
                  />
                  <svg
                    className="absolute bottom-0 left-0 text-line"
                    width="48"
                    height={FORK}
                    viewBox={`0 0 48 ${FORK}`}
                    fill="none"
                  >
                    <path
                      d={`M${x} 0 C ${x} ${FORK * 0.6}, ${LANE_X[0]} ${FORK * 0.4}, ${LANE_X[0]} ${FORK}`}
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </>
              )}
              <span
                className="absolute size-3 rounded-full border-[3px] bg-paper"
                style={{
                  left: x - 6,
                  top: DOT_TOP,
                  borderColor: `var(--tag-${commit.color}-ink)`,
                }}
              />
            </div>
            <CommitBody commit={commit} last={last} />
          </li>
        )
      })}
    </ol>
  )
}

function CommitBody({ commit, last }: { commit: Commit; last: boolean }) {
  const header = (
    <>
      <p className="font-mono text-[11px] leading-6 text-faint">
        <span style={{ color: `var(--tag-${commit.color}-ink)` }}>{commit.hash}</span>
        {commit.ref && <span className="text-accent"> ({commit.ref})</span>} · {commit.period}
      </p>
      <p className="font-medium text-heading">
        {commit.role}
        <span className="font-normal text-muted">
          {' · '}
          {commit.url ? (
            <a href={commit.url} className="text-accent underline-offset-3 hover:underline">
              {commit.company}
            </a>
          ) : (
            commit.company
          )}
          {commit.place && `, ${commit.place}`}
        </span>
      </p>
      {commit.stack.length > 0 && (
        <p className="mt-1 font-mono text-[11px] text-faint">{commit.stack.join(' · ')}</p>
      )}
    </>
  )

  return (
    <div className={last ? '' : 'pb-7'}>
      {commit.details.length === 0 ? (
        header
      ) : (
        <details className="group">
          <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            {header}
            <span className="mt-1 inline-block font-mono text-[11px] text-faint group-open:hidden hover:text-accent">
              git show ▸
            </span>
          </summary>
          <ul className="mt-2 space-y-1.5 border-l border-line pl-3 text-sm leading-relaxed text-muted">
            {commit.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
