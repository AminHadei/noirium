import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';
import { h, nextTick } from 'vue';

import { Popover, PopoverContent, PopoverTrigger } from '@/features/feedback';

describe('Popover', () => {
  it('toggles the content from the trigger', async () => {
    const wrapper = mount(Popover, {
      attachTo: document.body,
      slots: {
        default: () => [h(PopoverTrigger, () => 'Open'), h(PopoverContent, () => 'Body')],
      },
    });

    expect(document.querySelector('[data-slot="popover-content"]')).toBeNull();

    await wrapper.find('[data-slot="popover-trigger"]').trigger('click');
    await nextTick();
    expect(document.querySelector('[data-slot="popover-content"]')?.textContent).toBe('Body');

    await wrapper.find('[data-slot="popover-trigger"]').trigger('click');
    await vi.waitFor(() => {
      expect(document.querySelector('[data-slot="popover-content"]')).toBeNull();
    });

    wrapper.unmount();
  });
});
