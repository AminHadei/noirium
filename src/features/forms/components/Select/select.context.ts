import type { InjectionKey, Ref } from 'vue';

export interface SelectContext {
  modelValue: Ref<string>;
  open: Ref<boolean>;
  triggerEl: Ref<HTMLElement | null>;
  placeholder: Ref<string>;
  labels: Ref<Map<string, string>>;
  setOpen: (value: boolean) => void;
  toggle: () => void;
  select: (value: string) => void;
  registerLabel: (value: string, label: string) => void;
}

export const selectContextKey: InjectionKey<SelectContext> = Symbol('NoiriumSelect');
