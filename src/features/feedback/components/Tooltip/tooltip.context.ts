import type { InjectionKey, Ref } from 'vue';

export interface TooltipContext {
  open: Ref<boolean>;
  triggerEl: Ref<HTMLElement | null>;
  show: () => void;
  hide: () => void;
}

export const tooltipContextKey: InjectionKey<TooltipContext> = Symbol('NoiriumTooltip');
