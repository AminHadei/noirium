// Split segments so UnoCSS does not emit a stray outline-muted utility rule.
// eslint-disable-next-line typescript-eslint/no-unnecessary-template-expression -- intentional split literal
type ToggleOutlineMutedVariant = `${'outline'}-${'muted'}`;

export type ToggleVariant = 'default' | 'outlined' | 'solid' | ToggleOutlineMutedVariant;
export type ToggleSize = 'default' | 'sm' | 'lg';
