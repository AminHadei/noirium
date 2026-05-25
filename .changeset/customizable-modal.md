---
'noirium': minor
---

Add `Modal` component — a fully customizable dialog with pluggable layouts.

- Two built-in layouts (`default`, `fullscreen`) plus a `:layout="MyLayout"` escape hatch so consumers can drop in their own component.
- Class-slot props (`backdrop`, `wrapper`, `body`, `header`, `content`, `footer`, `closeButton`) override every visual zone.
- Slots: `default` / `content`, `header`, `footer`, `close-icon`.
- Built-in layouts now honor the host app's dark state automatically, so the modal treatment no longer requires extra class overrides or a dedicated prop.
- Responsive bottom-sheet — the default layout slides up from the bottom on mobile when `:modal-only="false"` (defaults to `true` so behavior stays modal-only unless opted in).
- Body scroll lock (ref-counted across stacked modals; opt out with `:lock-scroll="false"`).
- `tried-close` event fires when a non-closable modal receives a close attempt, letting parents render confirm dialogs.
- Reuses the existing dialog stack so `BaseDialog` and `Modal` share z-index ordering and topmost-only Escape semantics.
- Unknown attrs and listeners on `<Modal>` forward to the resolved layout, so custom layouts can declare their own props/emits (e.g. `tone`, `confirmLabel`, `@confirm`).
- New `createTypedModal(layout)` helper returns a wrapper component whose props/emits are inferred from the layout, giving consumers full editor autocomplete and type-safe events on layout-specific props alongside Modal shell props.
- Exposes `useModalContext()` for custom layouts and a Web Component build (`noirium-modal`).

`BaseDialog` is unchanged.
