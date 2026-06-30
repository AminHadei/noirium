import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';

import { IconButton } from '@/features/buttons';

describe('IconButton', () => {
  it('renders a button with slotted icon content', () => {
    const wrapper = mount(IconButton, { slots: { default: '<span class="icon" />' } });
    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.find('.icon').exists()).toBe(true);
  });

  it('applies outline variant classes', () => {
    const wrapper = mount(IconButton, { props: { variant: 'outline' } });
    expect(wrapper.classes()).toContain('border-primary');
    expect(wrapper.classes()).toContain('bg-transparent');
  });

  it('does not respond when disabled', async () => {
    const onClick = vi.fn<() => void>();
    const wrapper = mount(IconButton, { props: { disabled: true, onClick } });
    await wrapper.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
