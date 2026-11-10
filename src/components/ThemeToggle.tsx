import { useEffect, useState } from 'react'

type Preference = 'auto' | 'light' | 'dark'

const STORAGE_KEY = 'theme'
const OPTIONS: Preference[] = ['auto', 'light', 'dark']
const LABELS: Record<Preference, string> = {
  auto: 'Suivre le thème du système',
  light: 'Thème clair',
  dark: 'Thème sombre',
}

/**
 * Inline script for <head>: applies the saved theme (or the OS preference) before first paint,
 * so dark mode never flashes light. No saved value means "auto".
 */
export const themeInitScript = `(()=>{try{var t=localStorage.getItem('${STORAGE_KEY}')}catch(e){}var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)})()`

const systemDark = () => matchMedia('(prefers-color-scheme: dark)')

function readPreference(): Preference {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'auto'
  } catch {
    return 'auto'
  }
}

function applyPreference(preference: Preference) {
  const dark = preference === 'dark' || (preference === 'auto' && systemDark().matches)
  document.documentElement.classList.toggle('dark', dark)
}

export function ThemeToggle() {
  // Unknown during prerender: the active option is shown after hydration.
  const [preference, setPreference] = useState<Preference | null>(null)

  useEffect(() => {
    setPreference(readPreference())
  }, [])

  // In auto mode, follow OS theme changes live.
  useEffect(() => {
    if (preference !== 'auto') return
    const media = systemDark()
    const onChange = () => applyPreference('auto')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [preference])

  const choose = (next: Preference) => {
    try {
      if (next === 'auto') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode or blocked storage: the choice just won't persist.
    }
    applyPreference(next)
    setPreference(next)
  }

  return (
    <div role="group" aria-label="Thème" className="flex items-center font-mono text-faint">
      <span aria-hidden="true">[</span>
      {OPTIONS.map((option, index) => (
        <span key={option} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="px-1">
              ·
            </span>
          )}
          <button
            type="button"
            onClick={() => choose(option)}
            aria-pressed={preference === option}
            title={LABELS[option]}
            className={
              preference === option ? 'text-accent' : 'text-muted transition-colors hover:text-ink'
            }
          >
            {option}
          </button>
        </span>
      ))}
      <span aria-hidden="true">]</span>
    </div>
  )
}
