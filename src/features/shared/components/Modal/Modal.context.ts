import { type Component, type InjectionKey, type Ref, inject } from 'vue';

export type ModalLayoutName = 'default' | 'fullscreen';

export type ModalClassValue = string | string[] | Record<string, boolean> | null | undefined;

export interface ModalClasses {
  backdrop?: ModalClassValue;
  wrapper?: ModalClassValue;
  body?: ModalClassValue;
  header?: ModalClassValue;
  content?: ModalClassValue;
  footer?: ModalClassValue;
  closeButton?: ModalClassValue;
}

export interface ModalProps {
  visible?: boolean;
  title?: string | null;
  layout?: Component | ModalLayoutName;
  closable?: boolean;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  modalOnly?: boolean;
  bottomSheetBreakpoint?: string;
  lockScroll?: boolean;
  teleportTo?: string;
  classes?: ModalClasses;
}

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
