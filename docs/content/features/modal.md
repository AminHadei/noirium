# Modal

A fully customizable dialog with pluggable layouts. The shell owns lifecycle (visibility, stack, scroll lock, escape, teleport, transitions); the layout owns visuals. Consumers pick a built-in layout, override class slots, or supply a layout component of their own.

`Modal` is a separate primitive from [`BaseDialog`](../../../src/features/shared/components/BaseDialog/BaseDialog.vue). Use `Modal` when you need pluggable layouts, responsive bottom-sheet behaviour, or want consumers to drop in their own visual shell. Use `BaseDialog` for the existing single-layout overlay.

## Quick start

```vue
<script setup lang="ts">
  import { Modal, PrimaryButton } from 'noirium/ui';
  import { ref } from 'vue';

  const open = ref(false);
</script>

<template>
  <PrimaryButton @click="open = true">Open</PrimaryButton>
  <Modal
    v-model:visible="open"
    title="Confirm action"
  >
    <p>Are you sure you want to proceed?</p>
    <template #footer>
      <PrimaryButton @click="open = false">Confirm</PrimaryButton>
    </template>
  </Modal>
</template>
```

The default layout renders a centered card with optional header, body, and footer.

## Layouts

Two built-in layouts ship with the library. Set with the `layout` prop:

| Value          | Behaviour                                                                         |
| -------------- | --------------------------------------------------------------------------------- |
| `'default'`    | Centered card with rounded corners, optional header/footer, fade-and-scale enter. |
| `'fullscreen'` | Edge-to-edge cover, used for immersive flows (onboarding, embedded forms).        |

Or pass a component value to render any custom layout — see [Custom layouts](#custom-layouts).

## Slots

Built-in layouts read these slots. Custom layouts may declare their own.

| Slot         | Renders                                            |
| ------------ | -------------------------------------------------- |
| `default`    | Body content (when neither `content` is provided). |
| `content`    | Body content. Takes precedence over `default`.     |
| `header`     | Replaces the header. Falls back to `title` prop.   |
| `footer`     | Footer area. Hidden when not provided.             |
| `close-icon` | Replaces the close button's icon.                  |

## Props

| Prop                    | Type                                     | Default                | Description                                                                                                               |
| ----------------------- | ---------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `visible`               | `boolean`                                | `false`                | `v-model:visible` target. Two-way bound.                                                                                  |
| `title`                 | `string \| null`                         | `null`                 | Header text. Layouts may render this directly or hand it to a `header` slot.                                              |
| `layout`                | `Component \| 'default' \| 'fullscreen'` | `'default'`            | Layout component or registry key.                                                                                         |
| `closable`              | `boolean`                                | `true`                 | When `false`, close attempts emit `tried-close` instead of closing.                                                       |
| `showCloseButton`       | `boolean`                                | `true`                 | Hides the X button while keeping the modal closable through other means.                                                  |
| `closeOnEscape`         | `boolean`                                | `true`                 | Escape closes the topmost modal.                                                                                          |
| `closeOnClickOutside`   | `boolean`                                | `true`                 | Backdrop click closes.                                                                                                    |
| `modalOnly`             | `boolean`                                | `true`                 | When `false`, the default layout flips to a bottom sheet at the configured breakpoint. See [Bottom sheet](#bottom-sheet). |
| `bottomSheetBreakpoint` | `string`                                 | `'(max-width: 768px)'` | Media query that triggers the bottom-sheet branch.                                                                        |
| `lockScroll`            | `boolean`                                | `true`                 | Locks `<body>` scroll while open. Ref-counted across stacked modals.                                                      |
| `teleportTo`            | `string`                                 | `'body'`               | Teleport target. Inside Shadow DOM the shell auto-detects the host root — see [Web components](../web-components.md).     |
| `classes`               | `ModalClasses`                           | `{}`                   | Per-zone class overrides. See [Class slots](#class-slots).                                                                |

## Events

| Event            | Payload            | When                                                                                                                                         |
| ---------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `update:visible` | `(value: boolean)` | Two-way binding for `visible`. Fired alongside `open` / `close`.                                                                             |
| `open`           | `()`               | Modal opened (programmatically or via `visible`).                                                                                            |
| `close`          | `()`               | Modal closed.                                                                                                                                |
| `tried-close`    | `()`               | A close attempt happened while `closable === false` (backdrop click, escape, programmatic `close`). Use this to mount a confirmation dialog. |

## Exposed methods

`<Modal>` exposes `open()`, `close()`, and `toggle()` so consumers can drive it via a `ref` instead of `v-model`.

```vue
<script setup lang="ts">
  import { Modal } from 'noirium/ui';
  import { useTemplateRef } from 'vue';
  const modal = useTemplateRef('modal');
</script>

<template>
  <button @click="modal?.open()">Open</button>
  <Modal
    ref="modal"
    title="Hello"
  >
    Body
  </Modal>
</template>
```

## Class slots

The `classes` prop accepts a per-zone override map. Each value is anything Vue's `:class` binding accepts (string, array, object). Classes are appended to the layout's defaults — they do not replace them.

```vue
<Modal
  v-model:visible="open"
  title="Themed"
  :classes="{
    backdrop: 'bg-black/60 backdrop-blur-md',
    body: 'bg-gradient-to-br from-neutral-100 to-white border-2 border-neutral-200',
    header: 'bg-neutral-100/60',
  }"
>
  …
</Modal>
```

Recognised zones: `backdrop`, `wrapper`, `body`, `header`, `content`, `footer`, `closeButton`. Custom layouts decide which they honour.

## Bottom sheet

Set `:modal-only="false"` to opt the **default layout** into a responsive bottom sheet. Below `bottomSheetBreakpoint` the modal slides up from the bottom with safe-area padding and a drag-handle indicator. Above the breakpoint it renders as a centered modal.

`modalOnly` defaults to `true`, so existing modal usage stays modal-only unless opted in.

```vue
<Modal v-model:visible="open" :modal-only="false" title="Adaptive Modal">
  Below 768px this slides up as a bottom sheet.
</Modal>
```

## Stacking

Multiple `<Modal>` instances stack correctly:

- **Z-index** is derived from stack position (`100000 + stackIndex * 10`) so each modal's backdrop layers over the one before it.
- **Escape** closes only the topmost modal.
- **Body scroll lock** is ref-counted — the lock is released only when the last open modal closes.
- The stack is shared with [`BaseDialog`](../../../src/features/shared/components/BaseDialog/BaseDialog.vue), so the two primitives interoperate.

## Persistent modals (intercepting close)

When the parent must approve a close (e.g. unsaved-changes prompt), set `:closable="false"` and listen for `tried-close`:

```vue
<Modal
  v-model:visible="open"
  :closable="false"
  title="Edit profile"
  @tried-close="confirmDiscard = true"
>
  …
</Modal>

<Modal v-model:visible="confirmDiscard" layout="default" title="Discard changes?">
  Your edits will be lost.
  <template #footer>
    <PrimaryButton @click="confirmDiscard = false">Keep editing</PrimaryButton>
    <PrimaryButton @click="discardAndClose">Discard</PrimaryButton>
  </template>
</Modal>
```

`tried-close` fires on backdrop click, escape, X button, and programmatic `close()` — anywhere the user signals intent to dismiss.

## Custom layouts

A layout is any Vue component that calls `useModalContext()` to read shell state and render whatever it likes. Authoring rules:

1. Live next to the consumer that uses them, not in `noirium` (the library ships only `default` + `fullscreen`).
2. Use `<script setup lang="ts">` with `inheritAttrs: false`.
3. Render a root with `role="dialog"` and `aria-modal="true"`.
4. Call `requestClose()` from the context — never close the modal manually. `requestClose()` honours `closable` and emits `tried-close` when needed.

```vue
<!-- ConfirmLayout.vue -->
<script setup lang="ts">
  import { useModalContext } from 'noirium/ui';

  type Tone = 'danger' | 'warning' | 'info';

  withDefaults(defineProps<{ tone?: Tone; confirmLabel?: string; cancelLabel?: string }>(), {
    tone: 'info',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  });

  const emit = defineEmits<{ confirm: []; cancel: [] }>();
  defineOptions({ name: 'ConfirmLayout', inheritAttrs: false });

  const { title, requestClose } = useModalContext();
</script>

<template>
  <div
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 flex items-center justify-center p-4"
    style="z-index: 100001"
    @click.self="requestClose"
  >
    <div class="rounded-2xl bg-white p-6 shadow-2xl">
      <h3>{{ title ?? 'Are you sure?' }}</h3>
      <slot />
      <button
        @click="
          emit('cancel');
          requestClose();
        "
      >
        {{ cancelLabel }}
      </button>
      <button
        @click="
          emit('confirm');
          requestClose();
        "
      >
        {{ confirmLabel }}
      </button>
    </div>
  </div>
</template>
```

Use it:

```vue
<Modal
  v-model:visible="open"
  :layout="ConfirmLayout"
  tone="danger"
  confirm-label="Delete"
  @confirm="handleDelete"
>
  This action cannot be undone.
</Modal>
```

`<Modal>` forwards unknown attrs and listeners to the resolved layout, so `tone`, `confirmLabel`, and `@confirm` reach `ConfirmLayout`.

### Modal context

`useModalContext()` returns a reactive object the layout reads from:

| Field             | Type                | Description                                                               |
| ----------------- | ------------------- | ------------------------------------------------------------------------- |
| `title`           | `Ref<string\|null>` | Title prop value.                                                         |
| `closable`        | `Ref<boolean>`      | Whether the modal can close.                                              |
| `showCloseButton` | `Ref<boolean>`      | Whether to render the close button.                                       |
| `isBottomSheet`   | `Ref<boolean>`      | `true` when below the bottom-sheet breakpoint and `modalOnly` is `false`. |
| `classes`         | `Ref<ModalClasses>` | Per-zone class overrides from the parent.                                 |
| `requestClose`    | `() => void`        | Calls the shell's close pipeline — respects `closable`.                   |

### `createTypedModal` — autocomplete for layout props

Wrapping a layout once gives consumers full editor autocomplete and type-safe events for layout-specific props alongside the Modal shell's props.

```ts
import { createTypedModal } from 'noirium/ui';
import ConfirmLayout from './ConfirmLayout.vue';

export const ConfirmModal = createTypedModal(ConfirmLayout);
```

```vue
<ConfirmModal
  v-model:visible="open"
  title="Delete project?"
  tone="danger"
  confirm-label="Delete"
  @confirm="handleDelete"
>
  Are you sure?
</ConfirmModal>
```

`tone`, `confirm-label`, and `@confirm` are typed against `ConfirmLayout`'s `defineProps` / `defineEmits`. Wrong literals (`tone="critical"`) are TypeScript errors. Hovering shows the originating type. The factory adds zero runtime cost — it's a thin `defineComponent` that forwards attrs to `<Modal :layout="layout">`.

Reach for `createTypedModal` whenever a layout has its own prop or event surface. Skip it when the only props in play come from `<Modal>` itself.

## Web components

`Modal.webc.ts` exists, so the modal is available as the `noirium-modal` custom element. The shell auto-detects the Shadow Root and teleports inside it (no `<Teleport to="body">` leak across the boundary). Bottom-sheet media queries respect the host's viewport.

Custom layouts are **not** part of the webc bundle — only the built-in `default` and `fullscreen` layouts are reachable via the `layout` attribute string. Webc consumers needing custom layouts should instead consume the lib build from a Vue host.

See [Web components](../web-components.md) for the full dual-build recipe.

## Test hooks

Layouts ship with stable `data-*` selectors so tests don't depend on UnoCSS class names:

| Selector                   | Maps to                          |
| -------------------------- | -------------------------------- |
| `[data-noirium-modal-backdrop]` | The backdrop element.            |
| `[data-noirium-modal-root]`     | The layout's outermost element.  |
| `[data-noirium-modal-body]`     | The card / sheet container.      |
| `[data-noirium-modal-content]`  | The scrollable content area.     |
| `[data-noirium-modal-close]`    | The close button (when present). |
| `[data-noirium-modal-handle]`   | The bottom-sheet drag handle.    |

Custom layouts are encouraged to forward the same `data-noirium-modal-*` attributes for consistency, but it isn't enforced.

## See also

- [Components](../components.md) — folder shape, naming, lazy-loaded overlay recipe (apply to modal containers that consumers code-split).
- [Web components](../web-components.md) — Shadow DOM teleport detection and dual-build pitfalls.
- [Testing](../testing.md) — VTU2 patterns for stacked dialogs, escape, and click-outside.
- [`BaseDialog`](../../../src/features/shared/components/BaseDialog/BaseDialog.vue) — the single-layout primitive.
