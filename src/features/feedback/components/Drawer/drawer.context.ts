import type { InjectionKey, Ref } from 'vue';

export type DrawerDirection = 'top' | 'bottom' | 'left' | 'right';

export interface DrawerContext {
  open: Ref<boolean>;
  direction: Ref<DrawerDirection>;
  setOpen: (value: boolean) => void;
  close: () => void;
}

export const drawerContextKey: InjectionKey<DrawerContext> = Symbol('NoiriumDrawer');
