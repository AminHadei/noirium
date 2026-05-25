import { type InjectionKey, type Ref, inject } from 'vue';

import type { ModalClasses } from '@/features/shared/components/Modal/Modal.types';

export interface ModalContext {
  title: Ref<string | null>;
  closable: Ref<boolean>;
  showCloseButton: Ref<boolean>;
  isBottomSheet: Ref<boolean>;
  classes: Ref<ModalClasses>;
  requestClose: () => void;
}

export const ModalContextKey: InjectionKey<ModalContext> = Symbol('ModalContext');

export function useModalContext(): ModalContext {
  const ctx = inject(ModalContextKey);
  if (!ctx) {
    throw new Error('useModalContext must be used inside a <Modal> component.');
  }
  return ctx;
}
