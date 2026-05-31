---
name: web-components
description: Use when editing files under src/features/**/*.webc.ts, the webc build script tools/vite/build-webc.ts, .webc.stories.ts files, or any component that ships as a custom element in noirium. Loads the dual-build rules — Shadow-DOM style injection via adoptSharedWebComponentStyles, popper positionFixed, useTeleportTarget, the @popperjs/core UMD alias, and the bundle-impact rule for new runtime deps.
---

# Web-component rules for noirium

The full rules — the webc build pipeline, the style-injection recipe, dual-build pitfalls, the `useTeleportTarget` requirement, and the webc-stories pairing — live in [`docs/content/web-components.md`](../../../docs/content/web-components.md).

That doc is the source of truth. Read it before touching any `.webc.ts`, the `tools/vite/build-webc.ts` script, the popper alias, or any popper-based / overlay component that can render inside a Shadow DOM.
