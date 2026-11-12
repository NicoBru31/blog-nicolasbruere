---
title: What's your excuse for not using Bun?
description: Node-compatible, fast, and one tool instead of five. And why Deno, which had almost everything, never got the same traction.
pubDate: 2026-11-12
tags: [tooling]
---

I keep hearing the same three excuses, and I've had them myself: "it'll break everything", "a few seconds saved, who cares", "yet another tool". All three fall apart, and each one matches one of Bun's strengths.

## "It'll break everything": no, Bun is Node-compatible

Two years ago at Braincube, we were on Yarn v1. Slow locally, slow in CI. Moving to Yarn Berry or pnpm meant changing the lockfile for the whole team and the whole CI at once.

Bun offered something else: it can write a `yarn.lock`.

```toml title="bunfig.toml"
[install.lockfile]
print = "yarn"
```

With those two lines, I used `bun install` on my machine while my colleagues and the CI stayed on Yarn, on the same file. Nobody had to know. Result: no regressions.

This is Bun's most underrated strength. It doesn't ask you to leave the Node ecosystem: it keeps `package.json`, the `node_modules` folder, the npm registry and the `node:*` modules. You can adopt it one command at a time, and roll back with a `git checkout`.

Some time later, I set up a monorepo with Bun workspaces. Bun worked as expected, and it was the first step toward adopting Bun across Braincube. Today, our apps and our libs each have their own monorepo on Bun.

Along the way, Bun workspaces bring catalogs: you declare a version once at the root, and every package points to it.

```json title="package.json"
{
  "workspaces": {
    "packages": ["apps/*", "libs/*"],
    "catalog": {
      "react": "19.2.0",
      "typescript": "6.0.2"
    }
  }
}
```

```json title="apps/web/package.json"
{
  "dependencies": {
    "react": "catalog:"
  }
}
```

Upgrading React across the whole monorepo means changing one line. No more packages each drifting toward their own version.

## "A few seconds, who cares": not anymore

Here are the numbers published on Bun's homepage, which happens to compare against Yarn 1.22, our Yarn v1:

| Scenario                                | Bun 1.4 | Yarn 1.22 |
| --------------------------------------- | ------- | --------- |
| CI without a cache (lockfile committed) | 0.95 s  | 17.6 s    |
| CI with a warm cache                    | 0.21 s  | 1.76 s    |
| Everything already up to date           | 12 ms   | 211 ms    |

_Source: [bun.sh](https://bun.sh), a T3 app with about 220 packages, Linux x64 (EPYC 9R14), median of 3 runs._

![Quicksilver, the X-Men mutant, running at full speed](/posts/all-in-on-bun/quicksilver.png)

Sixteen seconds per install doesn't sound like much. Except that with AI, PRs multiply, and every PR triggers several CI runs. A team running 100 CI runs a day spends nearly half an hour of CI a day just installing dependencies with Yarn v1, against under two minutes with Bun.

And it's not just CI. A coding agent runs the linter, the type checker and the tests in a loop, dozens of times per task. Every second saved on those commands is saved on every turn of the loop. Again according to Bun's homepage:

- `bun fmt` formats Prettier's own repo in 59.7 ms, against 17.1 s for Prettier.
- `bun check` checks the MUI docs in 1.31 s, against 10.28 s.

Now that nobody counts PRs anymore, every gain is worth taking.

## "Yet another tool": no, one tool instead of five

This is the gain I didn't expect. Bun doesn't add to your tooling, it replaces it:

| Role            | Usually          | With Bun      |
| --------------- | ---------------- | ------------- |
| Package manager | npm, Yarn, pnpm  | `bun install` |
| Tests           | Jest, Vitest     | `bun test`    |
| Formatting      | Prettier         | `bun fmt`     |
| Linting         | ESLint           | `bun lint`    |
| Type checking   | `tsc`            | `bun check`   |
| Build           | esbuild, webpack | `bun build`   |

Fewer tools mostly means fewer config files. This blog has no `.prettierrc`, no `eslint.config.js`, no `vitest.config.ts`. Everything fits in one `bunfig.toml`:

```toml title="bunfig.toml"
[install]
exact = true

[test]
root = "./src"

[lint]
typeAware = true
ignorePatterns = ["src/routeTree.gen.ts", "dist/"]

[fmt]
printWidth = 100
semi = false
singleQuote = true
```

One trap to know about: `bun lint`, `bun fmt` and `bun check` first run the script of the same name in `package.json` if there is one. If your `lint` script calls `bun lint`, it calls itself in a loop. Add `--no-script`:

```json title="package.json"
{
  "scripts": {
    "format": "bun fmt --no-script",
    "lint": "bun lint --no-script --max-warnings 0",
    "check": "bun check --no-script",
    "test": "bun test"
  }
}
```

On the testing side, `bun test` aims for Jest compatibility, and a file that imports from `vitest` gets its functions from Bun. The docs admit not everything is implemented yet: for a large Vitest suite, run both side by side before switching.

## So why didn't Deno take off?

Deno had almost everything, and long before Bun: a formatter, a linter, a test runner and native TypeScript in a single binary, as early as its 1.0 release in 2020.

But Deno was born from a talk by Ryan Dahl, Node's creator, titled "10 Things I Regret About Node.js". Its goal was to fix Node by breaking away from it: no `package.json`, no `node_modules`, URL imports. Technically, that was defensible. In practice, adopting Deno meant rewriting your project, not swapping a tool.

npm compatibility arrived bit by bit, up to Deno 2 in late 2024. Too late: Bun 1.0 had shipped a year earlier, pitched from day one as a drop-in replacement for Node.

The lesson: for a tool, adoption cost matters more than features. Deno asked you to leave everything at once. Bun only asks for one command.

## No more excuses

Start with `bun install` on your current project. If something breaks, one `git checkout` and you've lost five minutes. If not, try `bun test`, then `bun fmt`, then the rest. That's exactly what I did.
