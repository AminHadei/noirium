import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';
import { h, nextTick } from 'vue';

import { Menu, MenuContent, MenuItem, MenuTrigger } from '@/features/navigation';

describe('Menu', () => {
  it('opens from the trigger and closes after selecting an item', async () => {
    const wrapper = mount(Menu, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(MenuTrigger, () => 'Open'),
          h(MenuContent, () => h(MenuItem, () => 'Profile')),
        ],
      },
    });

    expect(document.querySelector('[role="menu"]')).toBeNull();

    await wrapper.find('[data-slot="menu-trigger"]').trigger('click');
    await nextTick();
    expect(document.querySelector('[role="menu"]')).not.toBeNull();

    document.querySelector<HTMLElement>('[data-slot="menu-item"]')?.click();
    await vi.waitFor(() => {
      expect(document.querySelector('[role="menu"]')).toBeNull();
    });

    wrapper.unmount();
  });
});
