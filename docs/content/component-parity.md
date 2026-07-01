# Component parity (Noirium ↔ Vetro)

Tracks cross-library component alignment. **Strategy: keep both** where overlap exists; removal is a separate decision.

Ports reimplement behavior and public API — never copy-paste SFCs. Styling always matches the target library's theme.

## Cross-links

| Doc                                                                                           | Repo                          |
| --------------------------------------------------------------------------------------------- | ----------------------------- |
| This tracker                                                                                  | Noirium (canonical checklist) |
| [Vetro mirror](https://github.com/AminHadei/vetro/blob/main/docs/content/component-parity.md) | Vetro-specific port table     |

## Overlap policy

| Area             | Noirium                   | Vetro                            | Policy                           |
| ---------------- | ------------------------- | -------------------------------- | -------------------------------- |
| Button           | `PrimaryButton`           | `Button`                         | Keep both                        |
| Badge            | `BaseBadge`               | `Badge`                          | Keep both; align props over time |
| Avatar           | `Avatar`                  | `Avatar`                         | Keep both                        |
| Checkbox / radio | `CheckInput`              | `Checkbox`, `RadioGroup`         | Keep both                        |
| Date             | `DateInput`, `DatePicker` | `Calendar`, `DatePicker`         | Keep all                         |
| Overlay          | `Modal`, `BaseDialog`     | `Dialog`, `Drawer`, `Modal`      | Keep all                         |
| Dropdown         | `BaseDropdown`            | `Select`, `Menu`, `BaseDropdown` | Keep all                         |
| Toast            | `Toast*` composables      | `Toaster` (sonner)               | Keep both                        |

## Phase checklist

### Phase 0 — Governance ✅

- [x] ADR [0002](./decisions/0002-multi-feature-component-layout.md)
- [x] This tracker + Vetro mirror
- [x] Auto-register Vue plugin from `noirium/ui` exports

### Phase 1 — Low-fit ✅

**→ Noirium:** `IconButton`, `Text`, `Label`, `Alert*`, `Loader`, `Progress`, `Input`, `Textarea`, `Switch`, `Slider`, `Empty*`, `Accordion*`, `Tabs*`, `Breadcrumb*`

**→ Vetro:** `Countdown`, `DateInput`, `InputNumber`

### Phase 2 — Compound / overlay ✅

**→ Noirium:** `Card*`, `Tooltip*`, `Table*`, `Field*`, `Popover*`, `Drawer*`, `Menu*`, `ContextMenu*`, `Toggle*`, `RadioGroup*`, `Carousel*`

**→ Vetro:** `Modal` (+ layouts, `createTypedModal`), `DatePicker`, `BaseDropdown`

### Phase 3 — Heavy ✅

**→ Noirium:** `Select*`, `Command*`, `TableOfContents` (charts deferred — optional)

**→ Vetro:** `PhoneNumberInput`, `CountryDropdown`

### Phase 4 — WebC + docs ✅

- [x] WebC: `IconButton`, `Input`, `Select` (parity high-traffic)
- [x] Vetro WebC: `Modal`, `DatePicker`, `BaseDropdown`, `CountryDropdown`, `PhoneNumberInput`
- [x] Cross-links between parity docs

## WebC coverage (parity additions)

| Scope                     | Count       | Notes                                                          |
| ------------------------- | ----------- | -------------------------------------------------------------- |
| Noirium features + shared | 119 bundles | `defineNoiriumElement` helper; auto-discovered by `build:webc` |
| Vetro features            | 131 bundles | `defineVetroElement` helper                                    |
| Playground webc           | both        | `playground/webc-loader.ts` + `pnpm playground:webc`           |
