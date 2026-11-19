---
title: Standardize without forbidding exploration
description: I brought TypeScript and Jotai into Braincube. One became a standard, the other made me "the Jotai guy".
pubDate: 2026-11-17
tags: [tooling]
---

I brought two tools into Braincube.

The first one is TypeScript. In 2021, none of our front-end projects were typed. Today, almost all of them are, and nobody would want to go back.

The second one is Jotai. I introduced it around the same time, on the same app, with the same conviction. The result: I became "the Jotai guy", and nobody dared touch a file that imported it without going through me.

Same curiosity, same good intentions, and two opposite outcomes. It took me a while to understand what set them apart. This post is my attempt to explain it.

## Exploring is part of the job

I spend a good share of my time keeping up with the ecosystem and trying out tools. This blog is a case in point: it exists partly because I wanted to try Bun's linter and formatter, TanStack Start, Redact and TanStack Markdown. (I'm a big fan of the work of Tanner Linsley and his teams.)

We often reduce the developer's job to writing code and fixing bugs, or, in 2026, to having an AI write them. I think the difference between a good developer and an average one is largely elsewhere: **spotting what's holding you back, and finding the right tool to unblock it.**

Here's what that looks like in practice.

## The scary JSON

In 2021, when I joined Braincube, I worked on an app we'll call Charts. It displays users' data as configurable charts.

Back then, the backend computed the rendering. Every action in the UI triggered an API call, which returned the chart's full configuration: a big JSON object, full of fields that depended on each other. A timeplot, for example, can draw several functions, each with its own point style and color. A heatmap has neither.

In a JavaScript codebase, nothing stopped you from writing this:

```js
// Nothing says this chart isn't a heatmap…
chart.pointStyle = 'circle'
// …or that `series` actually exists in this response.
const values = chart.series[0].values
```

It worked in dev, and sometimes broke in prod. We could keep crossing our fingers at every release, but that's a bet you always end up losing.

So I looked for a tool that would guarantee three things:

1. That the object we handle matches the format the API returns.
2. That we can't change it in a way the chart type forbids.
3. As a bonus, that these errors show up in the IDE, not at runtime.

In 2026, the answer seems obvious: TypeScript, plus a runtime validator like Zod or Valibot for the first point. The second one is solved with a discriminated union:

```ts
type Chart =
  | { type: 'timeplot'; pointStyle: PointStyle; pointColor: string; series: Series[] }
  | { type: 'heatmap'; colorScale: ColorScale; series: Series[] }

const heatmap: Chart = { type: 'heatmap', colorScale, series }
heatmap.pointStyle = 'circle'
// ❌ Error in the IDE: a heatmap has no `pointStyle`
```

But in 2021, it wasn't that obvious. Valibot didn't exist, Zod was barely a year old, and TypeScript was only just becoming the standard it is today. There were other serious candidates:

- **Flow**, or **JSDoc with `// @ts-check`**, which had the advantage of not forcing us to rename files.
- **Elm** or **ReScript**, which guarantee even more, but at the cost of a new language for the whole team.

Rather than going with my gut, I set some criteria:

- an active, growing community;
- a simple setup;
- backward compatibility with the existing code;
- the possibility of incremental adoption.

I tested each option against this grid, then presented the problem, the chosen solution and the grid itself to my manager. He approved, and TypeScript started spreading through Braincube.

Today, almost all our projects have been migrated. On the TypeScript projects, we've gained a lot of development time, and the number of bugs has dropped significantly compared to the projects still in JS.

## The flip side: a scattered stack

Exploring has a cost, one I only understood over time, moving from startups to mid-sized companies.

I've lived it: going from a TypeScript project to a Flow one, from a GraphQL API to a REST one, from a Cypress test suite to a Playwright one, all in the same day, is exhausting mental gymnastics. And even in the age of AI, it's simpler and cheaper to have the same skills and plugins across every project.

A recent example convinced me. To speed up our CI, I turned off Vitest's isolation on every Braincube front-end project. In essence:

```ts
// The Vitest config shared by all our front-end projects
export default defineConfig({
  test: {
    isolate: false,
  },
})
```

One line, plus fixing two or three tests that relied on isolation. Some jobs went from 20 to 5 minutes, and we save more than 5 hours of CI a day. The bottleneck isn't even running the tests anymore, but downloading the Docker image and installing dependencies.

That was only possible because all our front-end projects use Vitest. Now imagine a third of them were on Jest, a third on Vitest and a third on `bun test`:

- three config files to maintain, at least;
- three sets of docs to dig through to find the equivalent of this optimization, if it exists;
- three libraries to keep up to date, each with its own breaking changes;
- in a monorepo like ours, heavier `node_modules` and longer installs in CI.

The win wouldn't fit in one line anymore.

There's also a quieter cost, one I've seen every time: **every technology ends up with its own expert.** The others don't learn it; they go to the expert when something breaks. Knowledge concentrates on a few people, and that's rarely a good sign for a company. With a single technology per need, everyone learns the same thing.

## The Jotai guy

Which brings me to the second tool.

Still on Charts, I pushed for Jotai for state management. I was convinced it was the right solution for that particular problem.

Except Braincube already had Redux (losing steam), Zustand and `React.createContext` for that role. Jotai became a fourth way of doing the same thing. And I became "the Jotai guy": nobody dared touch a file that imported the library without checking with me first.

That's exactly the problem I just described. And I was the one who created it.

## What sets them apart

Looking back, Jotai wasn't a bad technical choice. The difference with TypeScript lies elsewhere.

**TypeScript filled a gap; Jotai added to a pile.** There was no typing solution at Braincube: TypeScript competed with nothing. Jotai, on the other hand, landed on a problem that had already been solved three times.

**TypeScript aimed at the whole company; Jotai, at a single app.** With its criteria grid and its approval, TypeScript was a candidate for the standard from day one. Jotai answered one app's needs, with no path to becoming shared, nor to replacing what already existed.

Hence the rule I follow now: **exploring is individual; adopting is collective.** I try everything that intrigues me, on a side project, a branch, or this blog. But before a tool enters a shared project, I ask myself five questions:

1. **What does it replace?** If the answer is "nothing, it adds to the rest", it needs a very good reason.
2. **Is it meant to go everywhere?** A tool that stays on a single project quickly becomes an island.
3. **Who other than me will be able to maintain it a year from now?**
4. **Will we be able to move away from it easily?** Migrating to a new technology is all the easier when the stack is already standardized: you replace a single tool, in one place, rather than three variants scattered around.
5. **How will I explain it to the team and train them?** A tool adopted without being explained is just one more expert. Some docs, a demo, a few pair-programming sessions: adoption really starts when the others can use it without me.

Bun followed this path, as I explain [in my previous post](/posts/all-in-on-bun). It started on my laptop alone, without changing anything for anyone else since it could write a `yarn.lock`. It proved itself on a monorepo, then became the standard for our apps and libraries. Exploration fed standardization instead of fragmenting it.

## The two go together

Standardizing isn't the enemy of curiosity: it's what makes it pay off. A shared stack turns a good idea into one line of config that benefits everyone. And exploring isn't the enemy of a shared stack: it's how the stack evolves.

The trap is confusing the two steps, and adopting a tool while you're still only exploring it.
