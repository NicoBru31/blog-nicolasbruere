# blog-nicolasbruere

Blog de dev (React, Rust, Java, CI/CD, Expo).

**Stack** : TanStack Start (prérendu statique) · runtime Redact · TanStack Markdown + Highlight · Tailwind · Cloudflare Workers · Bun canary pour tout l'outillage.

## Démarrer

Bun canary est fourni par `mise.toml` (voir `mise trust`).

```bash
bun install
bun run dev        # http://localhost:3000
```

## Commandes

| Commande                    | Rôle                                                       |
| --------------------------- | ---------------------------------------------------------- |
| `bun run verify`            | Tout ce que fait la CI : format, lint, types, tests, build |
| `bun run format`            | `bun fmt`                                                  |
| `bun run lint`              | `bun lint` (type-aware)                                    |
| `bun run check`             | `bun check` (types)                                        |
| `bun test`                  | tests unitaires (`src/**/*.test.ts`)                       |
| `bun run build`             | build + prérendu dans `dist/client`                        |
| `bun run preview`           | sert le build avec le runtime Cloudflare local             |
| `bun run gen:highlight-css` | régénère `src/highlight.css` après un changement de thème  |

## Langues

Anglais à la racine (`/about`), français sous `/fr/` (`/fr/about`) : une seule arborescence de routes sous `src/routes/{-$locale}/`. Les textes de l'interface sont dans `src/lib/i18n.ts` (un test vérifie que `en` et `fr` ont les mêmes clés). `/en/…` renvoie une 404.

## Écrire un article

Chaque article est un dossier `content/posts/AAAA-MM-slug/` avec **deux fichiers obligatoires**, `en.md` et `fr.md` (le préfixe de date ne sert qu'au tri ; les URL sont `/posts/slug` et `/fr/posts/slug`). `bun test` échoue si l'un manque ou si les métadonnées partagées (`pubDate`, `tags`, `draft`…) diffèrent entre les deux. Même principe pour les fiches de lecture dans `content/readings/<slug>/`.

```md
---
title: Mon article
description: Résumé en une phrase (160 caractères max).
pubDate: 2026-11-10
tags: [react]
draft: true
---
```

- Tags autorisés : liste `TAGS` dans `content-collections.ts` (une faute de frappe fait échouer le build).
- `draft: true` : visible en dev, absent du build.
- Blocs de code : ` ```tsx title="fichier.tsx" {2} ` (titre et lignes surlignées).
- Callouts : `> [!TIP]`, `> [!WARNING]`…
- Composant React : `<!-- ::counter start="3" -->`. Pour en ajouter un, l'enregistrer sous la clé `blog-<nom>` dans `src/components/markdown/Article.tsx`.

## Comment le contenu est rendu

Le Markdown est parsé **au build** (`content-collections.ts` → `src/lib/markdown/compile.ts`) et le code y est coloré avec TanStack Highlight. Le navigateur reçoit un AST JSON déjà coloré : ni parser de coloration, ni grammaires dans le bundle client. Les posts passent par des server functions (`src/lib/content.ts`), donc la collection complète n'est jamais embarquée côté client.
