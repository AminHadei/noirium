import type { InjectionKey } from 'vue';

import type { RadioSize, RadioVariant } from './radio.types';

export interface RadioGroupContext {
  name: string;
  variant: RadioVariant;
  size: RadioSize;
  disabled: boolean;
  isSelected: (value: string) => boolean;
  select: (value: string) => void;
}

export const RadioGroupContextKey: InjectionKey<RadioGroupContext> = Symbol(
  'NoiriumRadioGroupContext',
);
