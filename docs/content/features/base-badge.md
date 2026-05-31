# BaseBadge

Compact pill label for status, counts, or metadata. Renders slot content inside a rounded badge with preset or custom colors.

## Quick start

```vue
<script setup lang="ts">
  import { BaseBadge } from 'noirium/ui';
</script>

<template>
  <BaseBadge color="red">Overdue</BaseBadge>
  <BaseBadge color="green">Active</BaseBadge>
  <BaseBadge color="gray">Draft</BaseBadge>
</template>
```

## Props

| Prop                | Type                                                                 | Default   | Description                                                                                                      |
| ------------------- | -------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `color`             | `'red' \| 'green' \| 'white' \| 'gray' \| 'black' \| 'custom'`       | `'red'`   | Preset palette. Use `'custom'` with `customBackground` / `customText` for one-off brand or chart colors.         |
| `customBackground`  | `string`                                                             | —         | CSS color for the pill background when `color="custom"` (e.g. `#E0E7FF`, `rgb(99 102 241 / 0.15)`).            |
| `customText`        | `string`                                                             | —         | CSS color for the label when `color="custom"`.                                                                   |

## Color variants

| `color`   | Background              | Label text        | Notes                                      |
| --------- | ----------------------- | ----------------- | ------------------------------------------ |
| `red`     | Soft rose tint          | Dark red          | Errors, overdue, destructive status        |
| `green`   | Soft mint tint          | Dark green        | Success, active, approved                  |
| `white`   | White                   | Near-black        | Includes `border` so it reads on pale UIs  |
| `gray`    | `surface` token         | `text-dark` token | Neutral / draft / disabled-style labels    |
| `black`   | `primary` token         | White             | High-emphasis monochrome pill              |
| `custom`  | `customBackground` prop | `customText` prop | Inline styles — not scanned by UnoCSS      |

Preset chromatic variants use `status-badge-*` theme tokens ([Styling → Status colors](../styling.md#status-colors-chromatic-exception)). Neutral variants use the monochrome palette only.

### Custom colors

Set `color="custom"` and pass both colors for predictable contrast:

```vue
<BaseBadge
  color="custom"
  custom-background="#EDE9FE"
  custom-text="#5B21B6"
>
  Enterprise
</BaseBadge>
```

In script setup, use camelCase props: `customBackground` and `customText`.

Custom values are applied via inline `style` so arbitrary hex/rgb values work without adding tokens to `uno.config.ts`. Prefer presets when a color is reused across the app; add a `status-badge-*` token in [uno.config.ts](../../uno.config.ts) instead of copying the same hex in many places.

If `color="custom"` is set but neither `customBackground` nor `customText` is provided, the badge falls back to the `gray` preset.

## Slots

| Slot      | Description        |
| --------- | ------------------ |
| `default` | Badge label content |

## See also

- [Styling](../styling.md) — theme tokens and status-color exceptions
- [Components](../components.md) — folder shape and Storybook requirements
- Storybook: **Shared UI → BaseBadge**
