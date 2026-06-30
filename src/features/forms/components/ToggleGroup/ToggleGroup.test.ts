import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';
import { h } from 'vue';

import { ToggleGroup, ToggleGroupItem } from '@/features/forms';

describe('ToggleGroup', () => {
  it('selects a single value', async () => {
    const onUpdate = vi.fn<(value: string | string[] | undefined) => void>();
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', 'onUpdate:modelValue': onUpdate },
      slots: {
        default: () => [
          h(ToggleGroupItem, { value: 'left' }, () => 'L'),
          h(ToggleGroupItem, { value: 'right' }, () => 'R'),
        ],
      },
    });
    await wrapper.findAll('button')[1]!.trigger('click');
    expect(onUpdate).toHaveBeenCalledWith('right');
  });

  it('accumulates values in multiple mode', async () => {
    const onUpdate = vi.fn<(value: string | string[] | undefined) => void>();
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: ['left'], type: 'multiple', 'onUpdate:modelValue': onUpdate },
      slots: {
        default: () => [
          h(ToggleGroupItem, { value: 'left' }, () => 'L'),
          h(ToggleGroupItem, { value: 'right' }, () => 'R'),
        ],
      },
    });
    await wrapper.findAll('button')[1]!.trigger('click');
    expect(onUpdate).toHaveBeenCalledWith(['left', 'right']);
  });
});
