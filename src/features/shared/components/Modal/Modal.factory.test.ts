import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { defineComponent, nextTick, ref } from 'vue';

import { useModalContext } from '@/features/shared/components/Modal/Modal.context';
import { createTypedModal } from '@/features/shared/components/Modal/Modal.factory';

const ConfirmLayout = defineComponent({
  name: 'ConfirmLayout',
  props: {
    tone: { type: String as () => 'danger' | 'info', default: 'info' },
    confirmLabel: { type: String, default: 'Confirm' },
  },
  emits: { confirm: null, cancel: null },
  setup(props, { emit }) {
    const ctx = useModalContext();
    return {
      props,
      emit,
      ctx,
    };
  },
  template: `
    <div data-typed-modal-layout :data-tone="props.tone">
      <span data-title>{{ ctx.title.value }}</span>
      <button data-confirm @click="emit('confirm')">{{ props.confirmLabel }}</button>
      <button data-cancel @click="emit('cancel')">Cancel</button>
    </div>
  `,
});

describe('createTypedModal', () => {
  let wrapper: ReturnType<typeof mount> | undefined;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('renders the wrapped layout when visible', async () => {
    const ConfirmModal = createTypedModal(ConfirmLayout);
    wrapper = mount(ConfirmModal, {
      props: { visible: true } as unknown as Record<string, unknown>,
      attachTo: document.body,
    });
    await nextTick();

    expect(document.querySelector('[data-typed-modal-layout]')).toBeTruthy();
  });

  it('forwards layout-specific props through to the layout', async () => {
    const ConfirmModal = createTypedModal(ConfirmLayout);
    wrapper = mount(ConfirmModal, {
      props: { visible: true, tone: 'danger', confirmLabel: 'Delete' } as unknown as Record<
        string,
        unknown
      >,
      attachTo: document.body,
    });
    await nextTick();

    const node = document.querySelector<HTMLElement>('[data-typed-modal-layout]');
    expect(node?.dataset['tone']).toBe('danger');
    expect(node?.querySelector('[data-confirm]')?.textContent).toBe('Delete');
  });

  it('forwards modal-shell props (title) through provide context', async () => {
    const ConfirmModal = createTypedModal(ConfirmLayout);
    wrapper = mount(ConfirmModal, {
      props: { visible: true, title: 'Delete project?' } as unknown as Record<string, unknown>,
      attachTo: document.body,
    });
    await nextTick();

    expect(document.querySelector('[data-title]')?.textContent).toBe('Delete project?');
  });

  it('emits layout events back to the parent', async () => {
    const ConfirmModal = createTypedModal(ConfirmLayout);
    const onConfirm = vi.fn<() => void>();
    wrapper = mount(ConfirmModal, {
      props: { visible: true, onConfirm } as unknown as Record<string, unknown>,
      attachTo: document.body,
    });
    await nextTick();

    const btn = document.querySelector('[data-confirm]') as HTMLButtonElement | null;
    btn?.click();
    await nextTick();

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('emits modal-shell events (update:visible, close)', async () => {
    const ConfirmModal = createTypedModal(ConfirmLayout);
    const onUpdate = vi.fn<() => void>();
    const onClose = vi.fn<() => void>();
    const visible = ref(true);
    wrapper = mount(ConfirmModal, {
      props: {
        visible: visible.value,
        'onUpdate:visible': onUpdate,
        onClose,
      } as unknown as Record<string, unknown>,
      attachTo: document.body,
    });
    await nextTick();

    const vm = wrapper.vm as unknown as { close: () => void };
    vm.close();
    await nextTick();

    expect(onUpdate).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('exposes open / close / toggle methods', async () => {
    const ConfirmModal = createTypedModal(ConfirmLayout);
    wrapper = mount(ConfirmModal, {
      props: { visible: false } as unknown as Record<string, unknown>,
      attachTo: document.body,
    });

    const vm = wrapper.vm as unknown as {
      open: () => void;
      close: () => void;
      toggle: () => void;
    };
    expect(typeof vm.open).toBe('function');
    expect(typeof vm.close).toBe('function');
    expect(typeof vm.toggle).toBe('function');

    vm.open();
    await nextTick();
    expect(document.querySelector('[data-typed-modal-layout]')).toBeTruthy();
  });
});
