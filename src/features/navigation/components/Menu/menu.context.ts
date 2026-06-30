import type { InjectionKey, Ref } from 'vue';

export interface MenuContext {
  open: Ref<boolean>;
  triggerEl: Ref<HTMLElement | null>;
  setOpen: (value: boolean) => void;
  toggle: () => void;
}

export const menuContextKey: InjectionKey<MenuContext> = Symbol('NoiriumMenu');
