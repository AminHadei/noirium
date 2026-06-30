import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';
import { h } from 'vue';

import { RadioGroup, RadioGroupItem } from '@/features/forms';

describe('RadioGroup', () => {
  it('renders items with a shared name', () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a', name: 'choice' },
      slots: {
        default: () => [h(RadioGroupItem, { value: 'a' }), h(RadioGroupItem, { value: 'b' })],
      },
    });
    const inputs = wrapper.findAll('input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]!.attributes('name')).toBe('choice');
  });

  it('selects an item on change', async () => {
    const onUpdate = vi.fn<(value: string | undefined) => void>();
    const wrapper = mount(RadioGroup, {
      props: { modelValue: '', 'onUpdate:modelValue': onUpdate },
      slots: {
        default: () => [h(RadioGroupItem, { value: 'a' }), h(RadioGroupItem, { value: 'b' })],
      },
    });
    await wrapper.findAll('input')[1]!.trigger('change');
    expect(onUpdate).toHaveBeenCalledWith('b');
  });

  it('shows the indicator for the selected item', () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a' },
      slots: {
        default: () => [h(RadioGroupItem, { value: 'a' }), h(RadioGroupItem, { value: 'b' })],
      },
    });
    const [first, second] = wrapper.findAllComponents(RadioGroupItem);
    expect(first!.find('span span').isVisible()).toBe(true);
    expect(second!.find('span span').isVisible()).toBe(false);
  });
});
