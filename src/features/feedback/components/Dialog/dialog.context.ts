import type { InjectionKey, Ref } from 'vue';

export interface DialogContext {
  open: Ref<boolean>;
  setOpen: (value: boolean) => void;
  close: () => void;
}

export const dialogContextKey: InjectionKey<DialogContext> = Symbol('NoiriumDialog');
