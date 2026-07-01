import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';
import { defineComponent, nextTick, ref } from 'vue';

import { CommandDialog, CommandInput, CommandItem, CommandList } from '@/features/command';

const waitForDialogClosed = async (): Promise<void> => {
  await vi.waitFor(() => {
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
};

const mountCommandDialog = (open = true): ReturnType<typeof mount> => {
  const Host = defineComponent({
    components: { CommandDialog, CommandInput, CommandList, CommandItem },
    setup: () => {
      const isOpen = ref(open);
      return { isOpen };
    },
    template: `
      <CommandDialog v-model:open="isOpen">
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandItem value="calendar">Calendar</CommandItem>
        </CommandList>
      </CommandDialog>
    `,
  });

  return mount(Host, { attachTo: document.body });
};

describe('CommandDialog', () => {
  it('closes when Escape is pressed', async () => {
    const wrapper = mountCommandDialog(true);
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();

    expect((wrapper.vm as unknown as { isOpen: boolean }).isOpen).toBe(false);
    await waitForDialogClosed();
    wrapper.unmount();
  });

  it('closes when the overlay is clicked', async () => {
    const wrapper = mountCommandDialog(true);
    const overlay = document.querySelector<HTMLElement>('.bg-gray-500\\/75');
    expect(overlay).not.toBeNull();

    overlay?.click();
    await nextTick();

    expect((wrapper.vm as unknown as { isOpen: boolean }).isOpen).toBe(false);
    await waitForDialogClosed();
    wrapper.unmount();
  });

  it('closes when a command item is selected', async () => {
    const wrapper = mountCommandDialog(true);
    const item = document.querySelector<HTMLElement>('[data-slot="command-item"]');
    expect(item).not.toBeNull();

    item?.click();
    await nextTick();

    expect((wrapper.vm as unknown as { isOpen: boolean }).isOpen).toBe(false);
    await waitForDialogClosed();
    wrapper.unmount();
  });

  it('does not render the BaseDialog close button', async () => {
    mountCommandDialog(true);
    await nextTick();

    expect(document.querySelector('[role="dialog"] button .i-close')).toBeNull();
  });
});
