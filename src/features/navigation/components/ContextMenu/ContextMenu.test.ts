import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';
import { h, nextTick } from 'vue';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/features/navigation';

describe('ContextMenu', () => {
  it('opens at the pointer position on right click and closes on select', async () => {
    const wrapper = mount(ContextMenu, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(ContextMenuTrigger, () => 'Area'),
          h(ContextMenuContent, () => h(ContextMenuItem, () => 'Delete')),
        ],
      },
    });

    expect(document.querySelector('[role="menu"]')).toBeNull();

    await wrapper
      .find('[data-slot="context-menu-trigger"]')
      .trigger('contextmenu', { clientX: 120, clientY: 80 });
    await nextTick();

    const content = document.querySelector<HTMLElement>('[data-slot="context-menu-content"]');
    expect(content).not.toBeNull();
    expect(content?.style.top).toBe('80px');
    expect(content?.style.left).toBe('120px');

    document.querySelector<HTMLElement>('[data-slot="context-menu-item"]')?.click();
    await vi.waitFor(() => {
      expect(document.querySelector('[role="menu"]')).toBeNull();
    });

    wrapper.unmount();
  });
});
