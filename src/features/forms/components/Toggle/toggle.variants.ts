import { createVariants } from '@/features/shared/lib/utils/variants.util';

import { TOGGLE_VARIANT_OUTLINE_MUTED } from './toggle.constants';
import type { ToggleVariant } from './toggle.types';

export const toggleVariants = createVariants({
  base: ':uno: inline-flex items-center justify-center gap-2 rounded-full font-noto text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-text-light disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: ':uno: bg-transparent text-text-dark hover:bg-surface hover:text-text-darker',
      outlined:
        ':uno: border-1 border-border bg-transparent text-text-dark hover:border-border-hover hover:text-text-darker',
      solid:
        ':uno: border-1 border-primary bg-transparent text-primary hover:border-text-darker hover:bg-primary hover:text-white',
      [TOGGLE_VARIANT_OUTLINE_MUTED]:
        ':uno: border-1 border-border bg-transparent text-text-light hover:bg-surface hover:text-text-dark',
    },
    size: {
      default: ':uno: h-9 min-w-9 px-4',
      sm: ':uno: h-8 min-w-8 px-3',
      lg: ':uno: h-10 min-w-10 px-5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export const togglePressedClasses: Record<ToggleVariant, string> = {
  default: ':uno: bg-surface text-text-darker',
  outlined: ':uno: border-border bg-primary text-white',
  solid: ':uno: border-primary bg-primary text-white',
  [TOGGLE_VARIANT_OUTLINE_MUTED]: ':uno: bg-surface text-text-darker',
};
