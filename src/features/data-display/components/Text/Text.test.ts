import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Text } from '@/features/data-display';

describe('Text', () => {
  it('renders as paragraph by default', () => {
    const wrapper = mount(Text, { slots: { default: 'Body copy' } });
    expect(wrapper.element.tagName).toBe('P');
    expect(wrapper.text()).toBe('Body copy');
  });

  it('renders heading level when as prop is set', () => {
    const wrapper = mount(Text, { props: { as: 'h2' }, slots: { default: 'Title' } });
    expect(wrapper.element.tagName).toBe('H2');
  });
});
