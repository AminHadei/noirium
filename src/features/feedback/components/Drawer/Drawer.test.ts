import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';
import { h, nextTick } from 'vue';

import { Drawer, DrawerContent, DrawerTrigger } from '@/features/feedback';

describe('Drawer', () => {
  it('opens from the trigger and applies the direction classes', async () => {
    const wrapper = mount(Drawer, {
      attachTo: document.body,
      props: { direction: 'left' },
      slots: {
        default: () => [h(DrawerTrigger, () => 'Open'), h(DrawerContent, () => 'Panel')],
      },
    });

    expect(document.querySelector('[data-slot="drawer-content"]')).toBeNull();

    await wrapper.find('[data-slot="drawer-trigger"]').trigger('click');
    await nextTick();

    const content = document.querySelector('[data-slot="drawer-content"]');
    expect(content).not.toBeNull();
    expect(content?.className).toContain('left-0');
    wrapper.unmount();
  });
});
