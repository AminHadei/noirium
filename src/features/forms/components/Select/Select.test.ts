import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';
import { h, nextTick } from 'vue';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/forms';

describe('Select', () => {
  it('opens, selects a value, and reflects the label', async () => {
    const onUpdate = vi.fn<(value: string | undefined) => void>();
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: {
        placeholder: 'Pick one',
        'onUpdate:modelValue': onUpdate,
      },
      slots: {
        default: () => [
          h(SelectTrigger, () => h(SelectValue)),
          h(SelectContent, () => [
            h(SelectItem, { value: 'apple' }, () => 'Apple'),
            h(SelectItem, { value: 'banana' }, () => 'Banana'),
          ]),
        ],
      },
    });

    expect(wrapper.find('[data-slot="select-value"]').text()).toBe('Pick one');
    expect(document.querySelector('[role="listbox"]')).toBeNull();

    await wrapper.find('[data-slot="select-trigger"]').trigger('click');
    await nextTick();
    expect(document.querySelector('[role="listbox"]')).not.toBeNull();

    const items = document.querySelectorAll<HTMLElement>('[data-slot="select-item"]');
    items[1]?.click();

    expect(onUpdate).toHaveBeenCalledWith('banana');
    await vi.waitFor(() => {
      expect(document.querySelector('[role="listbox"]')).toBeNull();
    });

    wrapper.unmount();
  });
});
