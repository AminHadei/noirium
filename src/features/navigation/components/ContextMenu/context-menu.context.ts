import type { InjectionKey, Ref } from 'vue';

export interface ContextMenuContext {
  open: Ref<boolean>;
  x: Ref<number>;
  y: Ref<number>;
  openAt: (clientX: number, clientY: number) => void;
  close: () => void;
}

export const contextMenuContextKey: InjectionKey<ContextMenuContext> = Symbol('NoiriumContextMenu');
