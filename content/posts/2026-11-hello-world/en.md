---
title: Hello world
description: First post — the blog's stack, and what each piece does.
pubDate: 2026-11-10
tags: [tooling, react]
---

This blog runs on **TanStack Start**, prerendered to static HTML, with the **Redact** runtime in the browser.

## The content

Posts are written in Markdown and parsed at build time by TanStack Markdown. Code is highlighted at build time by TanStack Highlight: the browser downloads neither grammars nor a tokenizer.

```tsx title="src/components/Greeting.tsx" {2}
export function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}
```

```rust
fn main() {
    let langs = ["React", "Rust", "Java"];
    for lang in langs.iter() {
        println!("{lang}");
    }
}
```

```yaml title=".github/workflows/ci.yml"
- uses: oven-sh/setup-bun@v2
  with:
    bun-version: canary
```

> [!TIP]
> GitHub callouts (`> [!TIP]`, `> [!WARNING]`…) are supported.

## An interactive demo

React components are embedded with an HTML comment:

<!-- ::counter start="3" -->

## The tooling

Everything goes through Bun: `bun install`, `bun fmt`, `bun lint`, `bun check`, `bun test`.
