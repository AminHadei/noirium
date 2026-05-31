---
layout: home

hero:
  name: 'Noirium UI'
  text: Developer docs
  tagline: Vue 3 + TypeScript UI kit that ships as both a library and standalone Web Components.
  actions:
    - theme: brand
      text: Get started
      link: /getting-started
    - theme: alt
      text: Architecture
      link: /architecture
    - theme: alt
      text: Recipes
      link: /recipes/
    - theme: alt
      text: Storybook ↗
      link: https://aminhadei.github.io/noirium/storybook/

features:
  - icon: 🚀
    title: Getting started
    details: Install, run, and ship a first change. Commands, env, and the toolchain in one page.
    link: /getting-started
    linkText: Start here
  - icon: 🧭
    title: Architecture
    details: Mental model, feature-first layout, dual-distribution (lib + web components), runtime-config facade.
    link: /architecture
    linkText: Read the architecture
  - icon: 🧩
    title: Components
    details: Folder structure, naming, lazy-loaded overlays, user-facing copy rules.
    link: /components
    linkText: Component conventions
  - icon: 🌐
    title: Web components
    details: The webc build, Shadow-DOM style injection, dual-build pitfalls, useTeleportTarget.
    link: /web-components
    linkText: Web components
  - icon: 🎨
    title: Styling
    details: 'UnoCSS wind4 preset, theme tokens, icons, the :uno: prefix and Shadow-DOM CSS.'
    link: /styling
    linkText: Styling
  - icon: 🔌
    title: API patterns
    details: ApiService, runtime-config facade, axios narrowing.
    link: /api-patterns
    linkText: API patterns
  - icon: 🧪
    title: Testing
    details: Vitest via vite-plus/test, MSW, VTU2 quirks, onClickOutside, vi.hoisted.
    link: /testing
    linkText: Testing
  - icon: 📦
    title: Changesets & releases
    details: Record changes on feature branches and the maintainer release flow on `main`.
    link: /changesets
    linkText: Changesets
  - icon: 📜
    title: Decisions (ADRs)
    details: The why behind structural choices.
    link: /decisions/
    linkText: Read the decisions
---

<div style="max-width: 980px; margin: 3rem auto 0; padding: 0 24px;">

## When to read what

| I'm about to…                                   | Read                                                              |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| Install and run for the first time              | [Getting started](./getting-started.md)                           |
| Look up _why_ something is shaped the way it is | [Decisions](./decisions/index.md)                                 |
| Add a new component                             | [Components](./components.md) + [Architecture](./architecture.md) |
| Expose a component as a web component           | [Web components](./web-components.md)                             |
| Style anything                                  | [Styling](./styling.md)                                           |
| Wire up an HTTP call                            | [API patterns](./api-patterns.md)                                 |
| Mock an endpoint in Storybook or tests          | [Storybook & MSW mocking](./storybook-mocking.md)                 |
| Write tests                                     | [Testing](./testing.md)                                           |
| Record a user-visible change                    | [Changesets](./changesets.md)                                     |
| Check a code-review rule                        | [Conventions](./conventions.md)                                   |
| Write a commit message                          | [Git conventions](./git-conventions.md)                           |
| Understand the toolchain                        | [Vite+](./vite-plus.md)                                           |
| Touch CI                                        | [CI](./ci.md)                                                     |

## Live site

Handbook and component demos are deployed from `main` via GitHub Pages:

- [aminhadei.github.io/noirium](https://aminhadei.github.io/noirium/) — docs
- [aminhadei.github.io/noirium/storybook](https://aminhadei.github.io/noirium/storybook/) — Storybook

## Project at a glance

- **Stack:** Vue 3 + TypeScript strict, UnoCSS (wind4), Vite+ toolchain.
- **Two distributions:** Vue library (`dist/lib/`) and standalone Web Components (`dist/webc/`) from one source tree.
- **Tests:** Vitest via `vite-plus/test` + `@vue/test-utils` v2 + jsdom + MSW.
- **Package manager:** pnpm (wrapped by Vite+; prefer `vp` commands).
- **Versioning:** Changesets. Never edit `package.json` version or `CHANGELOG.md` by hand.

</div>
