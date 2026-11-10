// Build-time only: imported by content-collections.ts and scripts, never by routes/components,
// so grammars and the tokenizer stay out of the client bundle.
import { createHighlighter } from '@tanstack/highlight/core'
import { css } from '@tanstack/highlight/languages/css'
import { diff } from '@tanstack/highlight/languages/diff'
import { dockerfile } from '@tanstack/highlight/languages/dockerfile'
import { html } from '@tanstack/highlight/languages/html'
import { java } from '@tanstack/highlight/languages/java'
import { js } from '@tanstack/highlight/languages/js'
import { json } from '@tanstack/highlight/languages/json'
import { jsx } from '@tanstack/highlight/languages/jsx'
import { rust } from '@tanstack/highlight/languages/rust'
import { shell } from '@tanstack/highlight/languages/shell'
import { toml } from '@tanstack/highlight/languages/toml'
import { ts } from '@tanstack/highlight/languages/ts'
import { tsx } from '@tanstack/highlight/languages/tsx'
import { yaml } from '@tanstack/highlight/languages/yaml'
import { createTanStackMarkdownHighlighter } from '@tanstack/highlight/markdown'

const highlighter = createHighlighter({
  languages: [css, diff, dockerfile, html, java, js, json, jsx, rust, shell, toml, ts, tsx, yaml],
})

export const highlightCode = createTanStackMarkdownHighlighter(highlighter)
