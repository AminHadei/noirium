import type { InjectionKey } from 'vue';

import type { ToggleSize, ToggleVariant } from '../Toggle/toggle.types';

export interface ToggleGroupContext {
  variant: ToggleVariant;
  size: ToggleSize;
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
}

export const ToggleGroupContextKey: InjectionKey<ToggleGroupContext> = Symbol(
  'NoiriumToggleGroupContext',
);
