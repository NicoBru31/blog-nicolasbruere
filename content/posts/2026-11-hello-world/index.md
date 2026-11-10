---
title: Hello world
description: Premier article — la stack du blog, et ce que chaque brique fait.
pubDate: 2026-11-10
tags: [tooling, react]
---

Ce blog tourne sur **TanStack Start**, prérendu en HTML statique, avec le runtime **Redact** côté navigateur.

## Le contenu

Les articles sont en Markdown, parsés au build par TanStack Markdown. Le code est coloré au build par TanStack Highlight : le navigateur ne télécharge ni grammaires ni tokenizer.

```tsx title="src/components/Greeting.tsx" {2}
export function Greeting({ name }: { name: string }) {
  return <h1>Bonjour, {name} !</h1>
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
> Les callouts GitHub (`> [!TIP]`, `> [!WARNING]`…) sont supportés.

## Une démo interactive

Les composants React s'insèrent avec un commentaire HTML :

<!-- ::counter start="3" -->

## L'outillage

Tout passe par Bun : `bun install`, `bun fmt`, `bun lint`, `bun check`, `bun test`.
