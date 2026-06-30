import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';

import { Toggle } from '@/features/forms';

describe('Toggle', () => {
  it('reflects pressed state via aria-pressed', async () => {
    const onUpdate = vi.fn<(value: boolean) => void>();
    const wrapper = mount(Toggle, {
      props: { modelValue: false, 'onUpdate:modelValue': onUpdate },
      slots: { default: 'B' },
    });
    expect(wrapper.attributes('aria-pressed')).toBe('false');
    await wrapper.trigger('click');
    expect(onUpdate).toHaveBeenCalledWith(true);
  });

  it('applies pressed classes when on', () => {
    const wrapper = mount(Toggle, { props: { modelValue: true } });
    expect(wrapper.classes()).toContain('bg-surface');
  });

  it('does not toggle when disabled', async () => {
    const onUpdate = vi.fn<(value: boolean) => void>();
    const wrapper = mount(Toggle, {
      props: { modelValue: false, disabled: true, 'onUpdate:modelValue': onUpdate },
    });
    await wrapper.trigger('click');
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
