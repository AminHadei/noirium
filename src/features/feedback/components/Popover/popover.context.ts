import type { InjectionKey, Ref } from 'vue';

export interface PopoverContext {
  open: Ref<boolean>;
  triggerEl: Ref<HTMLElement | null>;
  setOpen: (value: boolean) => void;
  toggle: () => void;
}

export const popoverContextKey: InjectionKey<PopoverContext> = Symbol('NoiriumPopover');
