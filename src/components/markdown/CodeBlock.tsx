import { useState } from 'react'

type CodeBlockProps = {
  lang: string
  code: string
  /** Escaped token markup produced at build time by TanStack Highlight. */
  html: string
  title?: string
}

export function CodeBlock({ lang, code, html, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <figure className="code-block not-prose">
      <figcaption className="code-block__header">
        <span>{title ?? lang}</span>
        <button type="button" onClick={copy} className="code-block__copy">
          {copied ? 'Copié' : 'Copier'}
        </button>
      </figcaption>
      <pre className="tm-code th-code" data-lang={lang}>
        {/* Trusted: TanStack Highlight escapes the source before emitting token spans. */}
        <code className={`language-${lang}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  )
}
