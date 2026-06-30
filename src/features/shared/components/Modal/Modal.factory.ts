import { type Component, type VNode, defineComponent, h, ref } from 'vue';
import type { ComponentEmit, ComponentProps, ComponentSlots } from 'vue-component-type-helpers';

import type { ModalProps } from '@/features/shared/components/Modal/Modal.context';
import Modal from '@/features/shared/components/Modal/Modal.vue';

interface ModalShellEmits {
  'update:visible': [value: boolean];
  open: [];
  close: [];
  'tried-close': [];
}

interface ModalShellExposed {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Wrap a layout component into a typed Modal. Consumers get full editor
 * autocomplete and event typing for the layout's props/emits, on top of the
 * Modal shell's own props (`visible`, `closable`, etc.).
 *
 * @example
 * ```ts
 * import ConfirmLayout from './ConfirmLayout.vue';
 * export const ConfirmModal = createTypedModal(ConfirmLayout);
 * ```
 *
 * ```vue
 * <ConfirmModal
 *   v-model:visible="open"
 *   tone="danger"
 *   confirm-label="Delete"
 *   @confirm="handleDelete"
 * >
 *   Are you sure?
 * </ConfirmModal>
 * ```
 */
export function createTypedModal<L extends Component>(
  layout: L,
): new () => {
  $props: ModalProps & ComponentProps<L>;
  $emit: ModalShellEmits & ComponentEmit<L>;
  $slots: ComponentSlots<L>;
} & ModalShellExposed {
  const Wrapped = defineComponent({
    name: 'TypedModal',
    inheritAttrs: false,
    setup(_props, { attrs, slots, expose }) {
      const modalRef = ref<ModalShellExposed | null>(null);

      expose({
        open: (): void => modalRef.value?.open(),
        close: (): void => modalRef.value?.close(),
        toggle: (): void => modalRef.value?.toggle(),
      });

      return (): VNode => h(Modal, { ...attrs, layout, ref: modalRef }, slots);
    },
  });

  return Wrapped as unknown as new () => {
    $props: ModalProps & ComponentProps<L>;
    $emit: ModalShellEmits & ComponentEmit<L>;
    $slots: ComponentSlots<L>;
  } & ModalShellExposed;
}
