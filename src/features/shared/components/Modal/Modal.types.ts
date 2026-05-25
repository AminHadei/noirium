import type { Component } from 'vue';

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
